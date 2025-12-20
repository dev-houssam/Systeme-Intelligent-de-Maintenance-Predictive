def combine(results, mode="AND"):
    if mode == "OR":
        return any(results)
    return all(results)
