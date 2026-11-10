from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table,
                                TableStyle, HRFlowable, ListFlowable, ListItem)

AZUL = colors.HexColor("#1F3864")
CINZA = colors.HexColor("#444444")

# ---------------------------------------------------------------- estilos
nome = ParagraphStyle("nome", fontName="Helvetica-Bold", fontSize=20,
                      textColor=AZUL, spaceAfter=2, leading=24)
cargo = ParagraphStyle("cargo", fontName="Helvetica", fontSize=11.5,
                       textColor=CINZA, spaceAfter=6, leading=14)
contacto = ParagraphStyle("contacto", fontName="Helvetica", fontSize=9.5,
                          textColor=CINZA, leading=13)
seccao = ParagraphStyle("seccao", fontName="Helvetica-Bold", fontSize=11,
                        textColor=AZUL, spaceBefore=8, spaceAfter=3, leading=13)
corpo = ParagraphStyle("corpo", fontName="Helvetica", fontSize=9.5,
                       leading=12.5, alignment=4, spaceAfter=3)
item = ParagraphStyle("item", fontName="Helvetica", fontSize=9.5,
                      leading=12, alignment=4)
cargo_b = ParagraphStyle("cargo_b", fontName="Helvetica-Bold", fontSize=9.5,
                         leading=12, spaceBefore=4)
local = ParagraphStyle("local", fontName="Helvetica-Oblique", fontSize=8.5,
                       textColor=CINZA, leading=11, spaceAfter=1)


def linha():
    return HRFlowable(width="100%", thickness=0.8, color=AZUL,
                      spaceBefore=1, spaceAfter=6)


def bullets(textos):
    return ListFlowable(
        [ListItem(Paragraph(t, item), leftIndent=10) for t in textos],
        bulletType="bullet", bulletChar="•", bulletFontSize=7,
        leftIndent=12, spaceBefore=1, spaceAfter=1)


# ================================================================ CV
def gerar_cv(caminho):
    doc = SimpleDocTemplate(caminho, pagesize=A4,
                            leftMargin=18 * mm, rightMargin=18 * mm,
                            topMargin=13 * mm, bottomMargin=13 * mm,
                            title="Curriculum Vitae - Jose Tito Joaquim Fernando Zic",
                            author="Jose Tito Joaquim Fernando Zic")
    s = []
    s.append(Paragraph("JOSE TITO JOAQUIM FERNANDO ZIC", nome))
    s.append(Paragraph("Técnico de Medicina Geral&nbsp;&nbsp;|&nbsp;&nbsp;"
                       "Licenciado em Psicologia Clínica", cargo))
    s.append(Paragraph(
        "Telefone: 870890007 / 845652267&nbsp;&nbsp;&bull;&nbsp;&nbsp;"
        "Email: titoszico@gmail.com&nbsp;&nbsp;&bull;&nbsp;&nbsp;Beira, Moçambique",
        contacto))
    s.append(linha())

    s.append(Paragraph("PERFIL PROFISSIONAL", seccao))
    s.append(Paragraph(
        "Profissional de saúde com mais de 18 anos de experiência em assistência médica "
        "e psicológica, combinando formação em Medicina Geral e Psicologia Clínica. "
        "Experiência consolidada em ITS/HIV/SIDA, aconselhamento e apoio psicossocial "
        "(ATS/APSS), atendimento e seguimento de casos de Violência Baseada no Género (VBG), "
        "bem como em funções de direcção e gestão de unidades e programas de saúde. "
        "Prática orientada para o cuidado integral, ético e centrado no paciente e na família.",
        corpo))

    s.append(Paragraph("FORMAÇÃO ACADÉMICA", seccao))
    s.append(Paragraph("Licenciatura em Psicologia Clínica", cargo_b))
    s.append(Paragraph("Universidade São Tomás de Moçambique (USTM)", local))
    s.append(Paragraph("Curso de Técnico de Medicina Geral", cargo_b))
    s.append(Paragraph("Ministério da Saúde (MISAU)", local))

    s.append(Paragraph("EXPERIÊNCIA PROFISSIONAL", seccao))

    s.append(Paragraph("Técnico de Medicina Geral", cargo_b))
    s.append(Paragraph("Centro de Saúde de Guijá-Sede &mdash; mais de 18 anos", local))
    s.append(bullets([
        "Assistência médica e psicológica a pacientes com diversas patologias.",
        "Atendimento, aconselhamento e seguimento de pacientes no âmbito das "
        "ITS/HIV/SIDA e do TARV adulto e pediátrico.",
        "Aconselhamento e Testagem em Saúde (ATS) e Apoio Psicossocial (APSS).",
        "Atendimento, acolhimento e seguimento de casos de Violência Baseada no "
        "Género (VBG), com escuta activa, confidencialidade, apoio emocional e "
        "encaminhamento articulado com outros sectores.",
        "Participação em workshops multissectoriais sobre VBG para seguimento de casos "
        "no distrito.",
    ]))

    s.append(Paragraph("Cargos de direcção e coordenação exercidos", cargo_b))
    s.append(bullets([
        "<b>Director Clínico</b> &mdash; coordenação da actividade clínica da unidade sanitária.",
        "<b>Director do Centro de Saúde</b> &mdash; gestão global da unidade, equipa e recursos.",
        "<b>Responsável de Nutrição do Distrito</b> &mdash; coordenação distrital do programa "
        "de nutrição e manejo da desnutrição.",
        "<b>Ponto Focal de ATS/APSS</b> &mdash; coordenação dos serviços de aconselhamento, "
        "testagem e apoio psicossocial.",
    ]))

    s.append(Paragraph("FORMAÇÃO COMPLEMENTAR", seccao))
    s.append(bullets([
        "CETA &mdash; Terapia de Elementos Comuns (saúde mental).",
        "Seguimento de Casos de Violência Baseada no Género (VBG) &mdash; MISAU.",
        "TARV Adulto e Pediátrico.",
        "Tutoria Clínica.",
        "Gestão de Programas de Saúde.",
        "Manejo de Desnutrição.",
    ]))

    s.append(Paragraph("COMPETÊNCIAS", seccao))
    s.append(bullets([
        "Avaliação clínica e acompanhamento psicológico integrado.",
        "Aconselhamento, escuta activa e apoio emocional.",
        "Gestão de confidencialidade e ética profissional.",
        "Atendimento a vítimas de VBG e articulação multissectorial.",
        "Direcção de unidade sanitária, gestão de equipas e de programas de saúde.",
        "Tutoria e formação de profissionais de saúde.",
    ]))

    s.append(Paragraph("IDIOMAS", seccao))
    tab = Table([
        [Paragraph("<b>Português</b>", item), Paragraph("Fluente", item)],
        [Paragraph("<b>Cena</b>", item), Paragraph("Fluente", item)],
        [Paragraph("<b>Ndau</b>", item), Paragraph("Fluente", item)],
        [Paragraph("<b>Changana</b>", item), Paragraph("Fluente", item)],
        [Paragraph("<b>Inglês</b>", item), Paragraph("Elementar", item)],
    ], colWidths=[40 * mm, 90 * mm])
    tab.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 1),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ]))
    s.append(tab)

    doc.build(s)


# ================================================================ CARTA
def gerar_carta(caminho):
    doc = SimpleDocTemplate(caminho, pagesize=A4,
                            leftMargin=25 * mm, rightMargin=25 * mm,
                            topMargin=20 * mm, bottomMargin=20 * mm,
                            title="Carta de Apresentação - Jose Tito Joaquim Fernando Zic",
                            author="Jose Tito Joaquim Fernando Zic")
    titulo = ParagraphStyle("titulo", fontName="Helvetica-Bold", fontSize=14,
                            textColor=AZUL, alignment=1, spaceAfter=4, leading=18)
    data = ParagraphStyle("data", fontName="Helvetica", fontSize=10,
                          alignment=2, spaceBefore=10, spaceAfter=16, leading=14)
    dest = ParagraphStyle("dest", fontName="Helvetica", fontSize=10.5,
                          leading=15, spaceAfter=4)
    assunto = ParagraphStyle("assunto", fontName="Helvetica-Bold", fontSize=10.5,
                             leading=15, spaceBefore=10, spaceAfter=14)
    par = ParagraphStyle("par", fontName="Helvetica", fontSize=10.5,
                         leading=16, alignment=4, spaceAfter=10)
    fecho = ParagraphStyle("fecho", fontName="Helvetica", fontSize=10.5,
                           leading=16, spaceBefore=12, spaceAfter=18)
    assin = ParagraphStyle("assin", fontName="Helvetica-Bold", fontSize=11,
                           textColor=AZUL, leading=15, spaceAfter=2)
    rodape = ParagraphStyle("rodape", fontName="Helvetica", fontSize=9.5,
                            textColor=CINZA, leading=13)

    s = []
    s.append(Paragraph("CARTA DE APRESENTAÇÃO", titulo))
    s.append(linha())
    s.append(Paragraph("Beira, 05 de Novembro de 2026", data))
    s.append(Paragraph("À Entidade Recrutadora,", dest))
    s.append(Paragraph("Assunto: Candidatura à Vaga de Saúde &mdash; Assistência Psicológica",
                       assunto))
    s.append(Paragraph("Exmos. Senhores,", par))

    s.append(Paragraph(
        "Chamo-me Jose Tito Joaquim Fernando Zic, sou Técnico de Medicina Geral e "
        "Licenciado em Psicologia Clínica pela Universidade São Tomás de Moçambique (USTM), "
        "e venho por este meio apresentar a minha candidatura à vaga de Assistência Psicológica.",
        par))

    s.append(Paragraph(
        "Com mais de 18 anos de experiência no Centro de Saúde de Guijá-Sede, desenvolvi um "
        "trabalho contínuo na assistência médica e psicológica a pacientes com várias "
        "patologias, com destaque para a área de ITS/HIV/SIDA, aconselhamento e apoio "
        "psicossocial (ATS/APSS).", par))

    s.append(Paragraph(
        "Para além disso, tenho experiência prática no atendimento e seguimento de vários "
        "casos de Violência Baseada no Género (VBG) no distrito, e participei em vários "
        "workshops sobre VBG a nível multissectorial para o seguimento de casos. Esta "
        "experiência reforçou a minha capacidade de escuta activa, acolhimento, "
        "confidencialidade, apoio emocional e encaminhamento adequado das vítimas, em "
        "articulação com outros sectores.", par))

    s.append(Paragraph(
        "Possuo ainda formações em CETA, Seguimento de Casos de VBG pelo MISAU, TARV Adulto "
        "e Pediátrico, Tutoria Clínica, Gestão de Programas de Saúde e Manejo de Desnutrição. "
        "Ao longo da minha carreira, exerci também funções de Director Clínico, Director do "
        "Centro de Saúde, Responsável de Nutrição do Distrito e Ponto Focal de ATS/APSS.", par))

    s.append(Paragraph(
        "A minha dupla formação permite-me unir o conhecimento clínico ao acompanhamento "
        "psicológico, garantindo um cuidado integral, ético e centrado no paciente e na sua "
        "família.", par))

    s.append(Paragraph(
        "Falo fluentemente Português, Cena, Ndau e Changana, e tenho Inglês elementar, o que "
        "me permite comunicar facilmente com diferentes comunidades.", par))

    s.append(Paragraph(
        "Estou disponível para contribuir com a minha experiência para a melhoria da "
        "qualidade dos serviços de saúde mental, apoio psicossocial e atendimento a vítimas "
        "de VBG na vossa instituição.", par))

    s.append(Paragraph(
        "Agradeço a atenção dispensada e coloco-me à disposição para uma entrevista.", par))

    s.append(Paragraph("Com os melhores cumprimentos,", fecho))
    s.append(Paragraph("Jose Tito Joaquim Fernando Zic", assin))
    s.append(Paragraph(
        "Telefone: 870890007 / 845652267<br/>Email: titoszico@gmail.com", rodape))

    doc.build(s)


if __name__ == "__main__":
    import os
    base = os.path.dirname(os.path.abspath(__file__))
    gerar_cv(os.path.join(base, "CV_Jose_Tito_Zic.pdf"))
    gerar_carta(os.path.join(base, "Carta_Apresentacao_Jose_Tito_Zic.pdf"))
    print("PDFs gerados com sucesso.")
