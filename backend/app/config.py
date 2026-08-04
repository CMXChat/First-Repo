from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration loaded from CMX_* environment variables."""

    environment: Literal["development", "staging", "production"] = "development"
    auth_mode: Literal["development", "cloudflare"] = "development"
    cloudflare_access_team_domain: str = ""
    cloudflare_access_audience: str = ""
    allowed_hosts_csv: str = "localhost,127.0.0.1,testserver,db.cmxchat.com"
    dns_timeout_seconds: float = Field(default=8.0, ge=1.0, le=30.0)
    dns_cache_ttl_seconds: int = Field(default=60, ge=0, le=3600)
    api_rate_limit_per_minute: int = Field(default=60, ge=1, le=10000)
    trust_proxy_headers: bool = True

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="CMX_",
        extra="ignore",
        case_sensitive=False,
    )

    @model_validator(mode="after")
    def validate_security_boundary(self) -> "Settings":
        if self.environment in {"staging", "production"} and self.auth_mode != "cloudflare":
            raise ValueError("staging and production require CMX_AUTH_MODE=cloudflare")
        if self.auth_mode == "cloudflare":
            if not self.cloudflare_access_team_domain.strip():
                raise ValueError("CMX_CLOUDFLARE_ACCESS_TEAM_DOMAIN is required")
            if not self.cloudflare_access_audience.strip():
                raise ValueError("CMX_CLOUDFLARE_ACCESS_AUDIENCE is required")
        return self

    @property
    def site_root(self) -> Path:
        return Path(__file__).resolve().parents[2]

    @property
    def allowed_hosts(self) -> list[str]:
        hosts = [item.strip() for item in self.allowed_hosts_csv.split(",") if item.strip()]
        return hosts or ["localhost", "127.0.0.1", "testserver"]

    @property
    def access_issuer(self) -> str:
        value = self.cloudflare_access_team_domain.strip().rstrip("/")
        if not value:
            return ""
        if not value.startswith(("http://", "https://")):
            value = f"https://{value}"
        return value

    @property
    def access_jwks_url(self) -> str:
        return f"{self.access_issuer}/cdn-cgi/access/certs" if self.access_issuer else ""


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
