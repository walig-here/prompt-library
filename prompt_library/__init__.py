from pathlib import Path

from prompt_library._template import PromptTemplate, VariableMapping

TEMPLATES_DIR: Path = Path(__file__).parent.parent.resolve()/"prompt-templates"


__all__ = ["TEMPLATES_DIR", "PromptTemplate", "VariableMapping"]
