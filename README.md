# Portion

A personal calorie and macro tracker — built as a self-contained web app, no backend required.

## Features

- **Goal setup wizard**: enter your current weight, target weight, and get three pacing options (fast/medium/slow), each showing a daily calorie target and projected goal date.
- **Daily meal log**: split into Breakfast, Lunch, Dinner, and Snacks, with a live calorie/macro ring that counts down as you log food.
- **Two ways to log food**:
  - **Search**: type-ahead over your own previously-logged foods plus a bundled common-foods list.
  - **Build from ingredients**: name a food and add ingredients by weight, drawn from a merged, deduplicated USDA FoodData Central ingredient list (Foundation Foods, FNDDS Survey Foods, and SR Legacy — 13,000+ ingredients). Built foods are saved to your personal library for reuse.
- **Flexible portions**: scale any logged food by whole numbers plus ¼, ⅓, ½, ⅔, or ¾ fractions.
- **Click-to-edit log entries**: tap anything you've logged to adjust its portion size or remove it. Foods built from ingredients show a read-only breakdown of what went into them.
- **Meal planner**: get recipe suggestions for a whole day or a specific meal, filtered by preferred ingredients and a max-calorie limit.
- **Progress tracking**: weight-over-time chart and goal progress against your target.
- Metric units (cm/kg) throughout.

## Running it

`portion.html` is a single self-contained file — open it directly in a browser, no build step or server needed. All data (profile, food log, food library) is stored locally.

## Data sources

Ingredient nutrition data is compiled from three USDA FoodData Central releases (Foundation Foods 2026-04-30, FNDDS Survey Foods 2024-10-31, SR Legacy 2018-04), merged and deduplicated by name. `scripts/build_ingredients.py` is the extraction/merge pipeline used to regenerate that dataset from the raw USDA JSON exports (not included here due to size — download them from [fdc.nal.usda.gov](https://fdc.nal.usda.gov/download-datasets)).

Ready-meal and recipe figures are approximate reference values, not sourced from USDA data.
