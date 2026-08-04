import json
import logging

from app.logging import JsonFormatter


def test_json_formatter_includes_operational_fields_only() -> None:
    record = logging.LogRecord(
        name="cmx.request",
        level=logging.INFO,
        pathname=__file__,
        lineno=1,
        msg="request_completed",
        args=(),
        exc_info=None,
    )
    record.request_id = "req-1"
    record.method = "GET"
    record.path = "/api/dns"
    record.status_code = 200
    record.duration_ms = 12.5
    record.identity = "opaque-subject"
    record.query_string = "name=sensitive.example"

    payload = json.loads(JsonFormatter().format(record))
    assert payload["request_id"] == "req-1"
    assert payload["path"] == "/api/dns"
    assert payload["identity"] == "opaque-subject"
    assert "query_string" not in payload
