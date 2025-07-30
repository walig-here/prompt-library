import unittest
from io import StringIO

from prompt_library._template import PromptTemplate


class PromptTemplateInit(unittest.TestCase):
    def test_when_template_has_variables_then_parse_content_and_variables(self) -> None:
        template_file: StringIO = StringIO(
            "Ala ma ${ZWIERZE} i kocha ${IMIE}. Bardzo lubi jeść ${DANIE} i "
            "wychodzić ze ${ZWIERZE}\n"
            "Ostatnio dałą także ${PRZEDMIOT} dla ${IMIE}."
        )

        template: PromptTemplate = PromptTemplate(template_file)

        self.assertEqual(
            template.variables, {"ZWIERZE", "IMIE", "DANIE", "PRZEDMIOT"}
        )


class PropmtTemplateFill(unittest.TestCase):
    def test_when_passed_variables_match_template_variables_then_fill_template(self) -> None:
        template_file: StringIO = StringIO(
            "Ala ma ${ZWIERZE} i kocha ${IMIE}. Bardzo lubi jeść ${DANIE} i "
            "wychodzić ze ${ZWIERZE}.\n"
            " Ostatnio dała także ${PRZEDMIOT} dla ${IMIE}."
        )
        template: PromptTemplate = PromptTemplate(template_file)

        filled_template: str = template.fill({
            "ZWIERZE": "kot",
            "IMIE": "Bartek", 
            "DANIE": "rosół", 
            "PRZEDMIOT": "czekolade"
        })

        self.assertEqual(
            filled_template,
            "Ala ma kot i kocha Bartek. Bardzo lubi jeść rosół i wychodzić ze kot.\n"
            " Ostatnio dała także czekolade dla Bartek."
        )