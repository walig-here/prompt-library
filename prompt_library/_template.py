import re
from io import TextIOBase

VariableMapping = dict[str, str | None]
"""Maps variable names to their values.

Key:
    Variable name.

Value:
    Variable value. None when it's undefined.
"""


class PromptTemplate:
    def __init__(self, template_file: TextIOBase) -> None:
        """Parses template file to store it for further handling.

        Detects all variables from template. Does not modify the template file.
        """
        self._content: str = template_file.read()
        self._variables: set[str] = {
            variable
            for variable in re.findall(r"\$\{([A-Z]+)\}", self._content)
        }
    
    @property
    def variables(self) -> set[str]:
        """Returns names of all variables present in the template."""
        return self._variables.copy()

    def fill(self, variable_definitions: VariableMapping) -> str:
        """Fills template with variable values.
        
        When variable from argument is present in template then its value is
        assigned to the template. Otherwise its ignored.

        Arguments:
            variable_definitions -- Map that assigns values of variables to
            their names.
        
        Returns:
            Filled template.
        """
        filled: str = str(self._content)
        for variable, value in variable_definitions.items():
            if variable not in self._variables:
                continue
            filled = filled.replace(f"${{{variable}}}", value)
        return filled


