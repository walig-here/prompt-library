import os
import sys
from pathlib import Path

import pyperclip

from prompt_library import TEMPLATES_DIR
from prompt_library._template import PromptTemplate, VariableMapping


def _select_template() -> Path:
    """Presents all templates and makes user to select one of them.

    User can select only those templates that are present int te *templates*
    directory.

    Returns:
        Absolute path to the selected template file.
    """
    templates: list[Path] = [
        TEMPLATES_DIR/template_file for template_file in os.listdir(TEMPLATES_DIR)
    ]

    while True:
        print(
            "AVAILABLE PROMPT TEMPLATES\n"
            "==========================\n",
            "\n".join(f"{index} -- {path.name}" for index, path in enumerate(templates)),
            "\n"
        )
        user_input: str = input("> ")

        if user_input == "q":
            sys.exit(0)
        try:
            return templates[int(user_input)]
        except (IndexError, ValueError):
            print("Invalid option! Try again or enter 'q' to exit.")
            print("\n\n\n")


def _insert_variables(variables: set[str]) -> VariableMapping:
    """Asks user to set non-empty values for all passed variables.

    Arguments:
        variables -- names of all variables that user needs to define

    Returns
        Map that assigns values defined by the user to the variables names.
    """
    variables_definitions: VariableMapping = {}
    print(
        "DEFINE VARIABLES NAMES\n"
        "======================\n"
    )

    for variable in variables:
        while True:
            print(f"Enter value for variable {variable}.\n")
            user_input: str = input("> ")
            if user_input:
                break
            print("\n\n")
        variables_definitions[variable] = user_input
    
    return variables_definitions


def run():
    with _select_template().open("r") as template_file:
        template: PromptTemplate = PromptTemplate(template_file)
    filled_template: str = template.fill(_insert_variables(template.variables))
    pyperclip.copy(filled_template)
    print("Filled prompt copied to clipboard!")


if __name__ == "__main__":
    run()
