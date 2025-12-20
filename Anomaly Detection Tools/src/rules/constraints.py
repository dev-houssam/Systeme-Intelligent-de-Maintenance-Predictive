OPERATORS = {
    ">": lambda a, b: a > b,
    "<": lambda a, b: a < b,
    "==": lambda a, b: a == b,
    "!=": lambda a, b: a != b,
}


def evaluate_condition(event, condition: dict) -> bool:
    field_value = getattr(event, condition["field"])
    return OPERATORS[condition["op"]](field_value, condition["value"])
