"""Logging helpers for MatterMind AI schema utilities.

This module provides a reusable logger configuration helper for the
MatterMind AI package.
"""

from __future__ import annotations

import logging
from logging import Logger
from typing import Optional

DEFAULT_LOGGER_NAME = "mattermind.ai"
DEFAULT_LOG_LEVEL = logging.INFO


def get_logger(name: Optional[str] = None) -> Logger:
    """Return a configured logger for the MatterMind AI package."""
    logger_name = name or DEFAULT_LOGGER_NAME
    logger = logging.getLogger(logger_name)
    if not logger.handlers:
        configure_logger(logger)
    return logger


def configure_logger(logger: Logger, level: int = DEFAULT_LOG_LEVEL) -> Logger:
    """Configure a logger with a standard console handler."""
    logger.setLevel(level)
    formatter = logging.Formatter(
        "%(asctime)s %(name)s %(levelname)s %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    handler = logging.StreamHandler()
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.propagate = False
    return logger


def set_log_level(level: int) -> None:
    """Set the log level for the default MatterMind AI logger."""
    logger = get_logger()
    logger.setLevel(level)


def disable_logger() -> None:
    """Disable the default MatterMind AI logger."""
    logging.getLogger(DEFAULT_LOGGER_NAME).disabled = True
