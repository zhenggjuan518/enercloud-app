from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from datetime import datetime
from pathlib import Path
from typing import Any

from playwright.sync_api import Error, Page, sync_playwright


BASE_URL = "http://127.0.0.1:5173"
ARTIFACTS_DIR = Path("docs/qa/artifacts")
REPORT_PATH = Path("docs/qa/playwright-mobile-smoke-report.md")
JSON_PATH = Path("docs/qa/playwright-mobile-smoke-result.json")


@dataclass
class CheckResult:
    name: str
    passed: bool
    details: str


def ensure_dirs() -> None:
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)


def screenshot(page: Page, name: str) -> str:
    path = ARTIFACTS_DIR / name
    page.screenshot(path=str(path), full_page=True)
    return str(path).replace("\\", "/")


def record(results: list[CheckResult], name: str, passed: bool, details: str) -> None:
    results.append(CheckResult(name=name, passed=passed, details=details))


def click_bottom_nav(page: Page, label: str) -> None:
    page.locator("nav button").filter(has_text=label).first.click()


def wait_for_text(page: Page, text: str) -> None:
    page.get_by_text(text, exact=False).first.wait_for(state="visible", timeout=10000)


def build_report(results: list[CheckResult], screenshots: list[str], started_at: str, finished_at: str) -> str:
    pass_count = sum(1 for item in results if item.passed)
    fail_count = len(results) - pass_count

    lines = [
        "# Playwright Mobile Smoke Test Report",
        "",
        f"- Started: {started_at}",
        f"- Finished: {finished_at}",
        f"- Base URL: `{BASE_URL}`",
        f"- Summary: `{pass_count} passed / {fail_count} failed`",
        "",
        "## Checks",
        "",
        "| Check | Result | Details |",
        "| --- | --- | --- |",
    ]

    for item in results:
        status = "PASS" if item.passed else "FAIL"
        lines.append(f"| {item.name} | {status} | {item.details} |")

    lines.extend(
        [
            "",
            "## Screenshots",
            "",
        ]
    )

    for item in screenshots:
        lines.append(f"- `{item}`")

    lines.append("")
    return "\n".join(lines)


def run() -> int:
    ensure_dirs()
    results: list[CheckResult] = []
    screenshots: list[str] = []
    started_at = datetime.now().isoformat(timespec="seconds")

    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=True)
            context = browser.new_context(**playwright.devices["iPhone 13"])
            page = context.new_page()

            page.goto(BASE_URL, wait_until="networkidle", timeout=20000)
            record(results, "Open login page", page.url.endswith("/login"), f"Current URL: {page.url}")
            screenshots.append(screenshot(page, "mobile-login.png"))

            page.locator('input[name="username"]').fill("admin")
            page.locator('input[name="password"]').fill("123456")
            page.get_by_role("button", name="Login").click()
            page.wait_for_url("**/overview", timeout=10000)
            wait_for_text(page, "Energy Flow Today")
            record(results, "Login flow", page.url.endswith("/overview"), f"Current URL: {page.url}")
            screenshots.append(screenshot(page, "mobile-overview.png"))

            header_hidden = page.evaluate(
                """() => {
                    const header = document.querySelector('header');
                    if (!header) return true;
                    const style = window.getComputedStyle(header);
                    const rect = header.getBoundingClientRect();
                    return style.display === 'none' || style.visibility === 'hidden' || rect.height === 0;
                }"""
            )
            record(results, "Top nav hidden on mobile", bool(header_hidden), f"header hidden: {header_hidden}")

            overflow = page.evaluate(
                """() => {
                    const width = window.innerWidth;
                    const bodyWidth = document.body.scrollWidth;
                    const docWidth = document.documentElement.scrollWidth;
                    return {
                        ok: bodyWidth <= width + 1 && docWidth <= width + 1,
                        width,
                        bodyWidth,
                        docWidth
                    };
                }"""
            )
            record(
                results,
                "No horizontal overflow on overview",
                bool(overflow["ok"]),
                f'viewport={overflow["width"]}, body={overflow["bodyWidth"]}, doc={overflow["docWidth"]}',
            )

            click_bottom_nav(page, "Status")
            page.wait_for_url("**/status", timeout=10000)
            wait_for_text(page, "Real-time Operation Status")
            record(results, "Navigate to status page", page.url.endswith("/status"), f"Current URL: {page.url}")
            screenshots.append(screenshot(page, "mobile-status.png"))

            page.locator("button").filter(has_text="View Cell Matrix Details").first.click()
            page.wait_for_url("**/cell-matrix", timeout=10000)
            wait_for_text(page, "Avg. Voltage")
            record(results, "Navigate to cell matrix", page.url.endswith("/cell-matrix"), f"Current URL: {page.url}")
            screenshots.append(screenshot(page, "mobile-cell-matrix.png"))

            click_bottom_nav(page, "Analysis")
            page.wait_for_url("**/analysis", timeout=10000)
            wait_for_text(page, "Energy Distribution Pie Chart")
            record(results, "Navigate to analysis page", page.url.endswith("/analysis"), f"Current URL: {page.url}")
            screenshots.append(screenshot(page, "mobile-analysis.png"))

            click_bottom_nav(page, "Reports")
            page.wait_for_url("**/reports", timeout=10000)
            wait_for_text(page, "Report Center")
            record(results, "Navigate to reports page", page.url.endswith("/reports"), f"Current URL: {page.url}")
            screenshots.append(screenshot(page, "mobile-reports.png"))

            report_filter_count = page.locator("button").filter(has_text="All").count()
            record(
                results,
                "Report filters rendered",
                report_filter_count > 0,
                f'All filter matches: {report_filter_count}',
            )

            report_markdown = build_report(
                results=results,
                screenshots=screenshots,
                started_at=started_at,
                finished_at=datetime.now().isoformat(timespec="seconds"),
            )
            REPORT_PATH.write_text(report_markdown, encoding="utf-8")
            JSON_PATH.write_text(
                json.dumps(
                    {
                        "started_at": started_at,
                        "finished_at": datetime.now().isoformat(timespec="seconds"),
                        "base_url": BASE_URL,
                        "results": [asdict(item) for item in results],
                        "screenshots": screenshots,
                    },
                    ensure_ascii=False,
                    indent=2,
                ),
                encoding="utf-8",
            )

            browser.close()

    except Error as exc:
        record(results, "Playwright runtime", False, str(exc).replace("\n", " "))
        report_markdown = build_report(
            results=results,
            screenshots=screenshots,
            started_at=started_at,
            finished_at=datetime.now().isoformat(timespec="seconds"),
        )
        REPORT_PATH.write_text(report_markdown, encoding="utf-8")
        JSON_PATH.write_text(
            json.dumps(
                {
                    "started_at": started_at,
                    "finished_at": datetime.now().isoformat(timespec="seconds"),
                    "base_url": BASE_URL,
                    "results": [asdict(item) for item in results],
                    "screenshots": screenshots,
                },
                ensure_ascii=False,
                indent=2,
            ),
            encoding="utf-8",
        )
        return 1

    failed = any(not item.passed for item in results)
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(run())
