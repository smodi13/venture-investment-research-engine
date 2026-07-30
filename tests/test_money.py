"""Exact decimal currency arithmetic + validation."""

from __future__ import annotations

import json
from decimal import Decimal

import pytest
import yaml

from sourcing.money import MoneyError, money_str, parse_money


def test_ten_posts_at_0_005_is_exactly_0_050():
    rate = parse_money("0.005", field="post_read_usd")
    assert rate * Decimal(10) == Decimal("0.050")


def test_budget_subtraction_is_exact():
    budget = parse_money("0.070")
    spent = Decimal("0.050")
    assert budget - spent == Decimal("0.020")


def test_quoted_yaml_decimal_strings_parse():
    data = yaml.safe_load('post_read_usd: "0.005"\nbudget: "0.070"\n')
    assert parse_money(data["post_read_usd"]) == Decimal("0.005")
    assert parse_money(data["budget"]) == Decimal("0.070")


@pytest.mark.parametrize("bad", [None, "", "  ", "abc", "NaN", "Infinity", "-Infinity", "placeholder", "unset"])
def test_invalid_and_non_finite_values_fail_closed(bad):
    with pytest.raises(MoneyError):
        parse_money(bad, field="x")


def test_boolean_values_are_rejected():
    with pytest.raises(MoneyError):
        parse_money(True, field="x")
    with pytest.raises(MoneyError):
        parse_money(False, field="x")


def test_zero_and_negative_rejected_by_default():
    with pytest.raises(MoneyError):
        parse_money("0")
    with pytest.raises(MoneyError):
        parse_money("0.000")
    with pytest.raises(MoneyError):
        parse_money("-0.010")


def test_float_source_is_rejected_no_binary_float_math():
    # A Python float must never be used as a monetary source value.
    with pytest.raises(MoneyError):
        parse_money(0.005)


def test_money_str_fixed_point_formatting():
    assert money_str(Decimal("0.05")) == "0.050"
    assert money_str(Decimal("0.02")) == "0.020"
    assert money_str(Decimal("5")) == "5.000"


def test_json_and_yaml_preserve_fixed_decimal_strings():
    payload = {"estimated_post_cost_usd": money_str(Decimal("0.05")),
               "remaining_budget_usd": money_str(Decimal("0.02"))}
    # JSON round-trip keeps the exact fixed-point strings.
    j = json.loads(json.dumps(payload))
    assert j["estimated_post_cost_usd"] == "0.050"
    assert j["remaining_budget_usd"] == "0.020"
    # YAML round-trip too.
    y = yaml.safe_load(yaml.safe_dump(payload))
    assert y["estimated_post_cost_usd"] == "0.050"
