import pytest
from pydantic import ValidationError

from app.config import Settings
from app.services.dns import normalize_dns_payload, validate_dns_name, validate_dns_type


def test_production_rejects_development_auth() -> None:
    with pytest.raises(ValidationError):
        Settings(environment="production", auth_mode="development")


def test_cloudflare_mode_requires_team_and_audience() -> None:
    with pytest.raises(ValidationError):
        Settings(environment="staging", auth_mode="cloudflare")


def test_dns_name_and_type_validation() -> None:
    assert validate_dns_name("_dmarc.Example.com.") == "_dmarc.example.com"
    assert validate_dns_type("txt") == "TXT"
    with pytest.raises(ValueError):
        validate_dns_name("https://example.com")
    with pytest.raises(ValueError):
        validate_dns_type("ANY")


def test_dns_payload_preserves_status_ttl_and_raw_data() -> None:
    normalized = normalize_dns_payload(
        "example.com",
        "TXT",
        {
            "Status": 0,
            "AD": True,
            "TC": False,
            "RA": True,
            "Answer": [
                {"name": "example.com.", "type": 16, "TTL": 300, "data": '"v=spf1 -all"'}
            ],
        },
    )
    assert normalized["status"] == 0
    assert normalized["authenticated_data"] is True
    assert normalized["answers"][0]["ttl"] == 300
    assert normalized["answers"][0]["data"] == '"v=spf1 -all"'
