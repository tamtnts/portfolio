from pathlib import Path
import shutil

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import (
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_PDF = ROOT / "public" / "NguyenThanhTam-CV.pdf"
OUTPUT_PDF = ROOT / "output" / "pdf" / "NguyenThanhTam-CV.pdf"

NAVY = colors.HexColor("#123047")
BLUE = colors.HexColor("#0E7490")
INK = colors.HexColor("#17202A")
MUTED = colors.HexColor("#52616B")
LIGHT = colors.HexColor("#E7EEF2")
PANEL = colors.HexColor("#F4F8FA")


def register_fonts():
    font_dir = Path("C:/Windows/Fonts")
    regular = font_dir / "arial.ttf"
    bold = font_dir / "arialbd.ttf"
    if regular.exists() and bold.exists():
        pdfmetrics.registerFont(TTFont("CVSans", str(regular)))
        pdfmetrics.registerFont(TTFont("CVSans-Bold", str(bold)))
        return "CVSans", "CVSans-Bold"
    return "Helvetica", "Helvetica-Bold"


BODY_FONT, BOLD_FONT = register_fonts()


def make_styles():
    base = getSampleStyleSheet()
    return {
        "name": ParagraphStyle(
            "Name",
            parent=base["Normal"],
            fontName=BOLD_FONT,
            fontSize=22,
            leading=25,
            textColor=NAVY,
            alignment=TA_CENTER,
            spaceAfter=2,
        ),
        "role": ParagraphStyle(
            "Role",
            parent=base["Normal"],
            fontName=BOLD_FONT,
            fontSize=10.5,
            leading=13,
            textColor=BLUE,
            alignment=TA_CENTER,
            spaceAfter=5,
        ),
        "contact": ParagraphStyle(
            "Contact",
            parent=base["Normal"],
            fontName=BODY_FONT,
            fontSize=8.4,
            leading=11,
            textColor=MUTED,
            alignment=TA_CENTER,
        ),
        "section": ParagraphStyle(
            "Section",
            parent=base["Heading2"],
            fontName=BOLD_FONT,
            fontSize=11,
            leading=14,
            textColor=NAVY,
            spaceBefore=8,
            spaceAfter=4,
            borderColor=BLUE,
            borderWidth=0,
            borderPadding=0,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["BodyText"],
            fontName=BODY_FONT,
            fontSize=8.8,
            leading=12.2,
            textColor=INK,
            spaceAfter=3,
        ),
        "small": ParagraphStyle(
            "Small",
            parent=base["BodyText"],
            fontName=BODY_FONT,
            fontSize=8,
            leading=10.5,
            textColor=MUTED,
        ),
        "job": ParagraphStyle(
            "Job",
            parent=base["BodyText"],
            fontName=BOLD_FONT,
            fontSize=9.6,
            leading=12,
            textColor=INK,
        ),
        "meta": ParagraphStyle(
            "Meta",
            parent=base["BodyText"],
            fontName=BODY_FONT,
            fontSize=8.2,
            leading=11,
            textColor=MUTED,
            alignment=TA_LEFT,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            parent=base["BodyText"],
            fontName=BODY_FONT,
            fontSize=8.6,
            leading=11.7,
            leftIndent=10,
            firstLineIndent=-6,
            textColor=INK,
            spaceAfter=1.8,
        ),
        "project": ParagraphStyle(
            "Project",
            parent=base["BodyText"],
            fontName=BOLD_FONT,
            fontSize=9.1,
            leading=11.5,
            textColor=NAVY,
            spaceAfter=1,
        ),
        "skill": ParagraphStyle(
            "Skill",
            parent=base["BodyText"],
            fontName=BODY_FONT,
            fontSize=8.2,
            leading=11,
            textColor=INK,
        ),
    }


STYLES = make_styles()


def section(title):
    return [
        Paragraph(title.upper(), STYLES["section"]),
        Table(
            [[""]],
            colWidths=[174 * mm],
            rowHeights=[0.55 * mm],
            style=TableStyle([("BACKGROUND", (0, 0), (-1, -1), BLUE)]),
        ),
        Spacer(1, 2.5 * mm),
    ]


def bullet(text):
    return Paragraph(f"- {text}", STYLES["bullet"])


def job_header(role, company, period=None):
    right = Paragraph(period or "", STYLES["meta"])
    table = Table(
        [[Paragraph(f"{role} | {company}", STYLES["job"]), right]],
        colWidths=[127 * mm, 47 * mm],
        hAlign="LEFT",
    )
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ALIGN", (1, 0), (1, 0), "RIGHT"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
            ]
        )
    )
    return table


def project_block(title, summary, contributions, stack):
    items = [
        KeepTogether(
            [
                Paragraph(title, STYLES["project"]),
                Paragraph(summary, STYLES["body"]),
            ]
        )
    ]
    items.extend(bullet(item) for item in contributions)
    items.append(
        Paragraph(f"<b>Stack:</b> {stack}", STYLES["small"])
    )
    return items


def draw_page(canvas, document):
    canvas.saveState()
    width, _ = A4
    canvas.setStrokeColor(LIGHT)
    canvas.setLineWidth(0.6)
    canvas.line(18 * mm, 13 * mm, width - 18 * mm, 13 * mm)
    canvas.setFont(BODY_FONT, 7.2)
    canvas.setFillColor(MUTED)
    canvas.drawString(18 * mm, 8.5 * mm, "Nguyen Thanh Tam - Middle Backend Developer")
    canvas.drawRightString(width - 18 * mm, 8.5 * mm, f"Page {document.page}")
    canvas.restoreState()


def build_story():
    story = [
        Paragraph("NGUYEN THANH TAM", STYLES["name"]),
        Paragraph("MIDDLE BACKEND DEVELOPER", STYLES["role"]),
        Paragraph(
            "Ho Chi Minh City | 0941 346 209 | "
            '<link href="mailto:tamtnts@gmail.com" color="#52616B">tamtnts@gmail.com</link>',
            STYLES["contact"],
        ),
        Paragraph(
            '<link href="https://github.com/tamtnts" color="#0E7490">github.com/tamtnts</link>'
            " | "
            '<link href="https://www.linkedin.com/in/tam-nguyen-thanh-338983260/" '
            'color="#0E7490">linkedin.com/in/tam-nguyen-thanh-338983260</link>',
            STYLES["contact"],
        ),
    ]

    story.extend(section("Professional Summary"))
    story.append(
        Paragraph(
            "Backend developer building maintainable REST APIs and data-intensive services for "
            "logistics operations. Experienced with service integration, asynchronous processing, "
            "database access, caching, operational search, and document workflows. Focused on clear "
            "service boundaries, reliable data flows, and practical production support.",
            STYLES["body"],
        )
    )

    story.extend(section("Core Skills"))
    skill_rows = [
        [
            Paragraph("<b>Backend</b><br/>Java 17, Spring Boot, REST, gRPC, OpenFeign", STYLES["skill"]),
            Paragraph("<b>Data</b><br/>Oracle, PostgreSQL, MongoDB, Elasticsearch", STYLES["skill"]),
            Paragraph("<b>Messaging and Cache</b><br/>Kafka, Redis, EMQX / MQTT", STYLES["skill"]),
        ],
        [
            Paragraph("<b>Infrastructure</b><br/>Kubernetes, Rancher, Nginx, Linux", STYLES["skill"]),
            Paragraph("<b>Delivery</b><br/>GitLab CI, Docker, Grafana, MinIO / S3", STYLES["skill"]),
            Paragraph("<b>Additional</b><br/>Netty / TCP, ShedLock, PDF generation", STYLES["skill"]),
        ],
    ]
    skill_table = Table(skill_rows, colWidths=[58 * mm] * 3, rowHeights=[18 * mm, 18 * mm])
    skill_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PANEL),
                ("BOX", (0, 0), (-1, -1), 0.5, LIGHT),
                ("INNERGRID", (0, 0), (-1, -1), 0.35, LIGHT),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    story.append(skill_table)

    story.extend(section("Professional Experience"))
    story.append(job_header("Middle Backend Developer", "GTEL OTS", "Aug 2024 - Present"))
    story.extend(
        [
            bullet(
                "Develop and maintain REST APIs for vehicle lookup, journey data, operational "
                "statistics, and record exports."
            ),
            bullet(
                "Design relational database structures, indexes, and queries for operational workloads."
            ),
            bullet(
                "Build Kafka consumers and synchronization workers for reliable asynchronous processing."
            ),
            bullet(
                "Use Redis for caching, temporary coordination state, rate limiting, and distributed locking."
            ),
            bullet(
                "Integrate internal services through gRPC and REST, normalizing contracts across boundaries."
            ),
            bullet(
                "Support Elasticsearch-backed search and template-driven PDF or document workflows."
            ),
        ]
    )
    story.append(Spacer(1, 2.5 * mm))
    story.append(job_header("Backend Developer Intern", "FPT Software Academy"))
    story.append(
        bullet(
            "Contributed to a Spring Boot training-management application by designing database "
            "structures, implementing CRUD features, testing, and fixing defects."
        )
    )

    story.extend(section("Education"))
    education = Table(
        [
            [
                Paragraph("<b>FPT University, Ho Chi Minh City</b><br/>Software Engineering - Good", STYLES["body"]),
                Paragraph("2019 - 2023", STYLES["meta"]),
            ]
        ],
        colWidths=[137 * mm, 37 * mm],
    )
    education.setStyle(
        TableStyle(
            [
                ("ALIGN", (1, 0), (1, 0), "RIGHT"),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    story.append(education)
    story.append(PageBreak())

    story.extend(section("Selected Professional Work"))
    story.append(
        Paragraph(
            "<b>Fleet Operations Platform</b> - Three connected backend services supporting "
            "operational workflows, administration, synchronization, search, and reporting. "
            "Project names and boundaries are generalized to protect confidential production details.",
            STYLES["body"],
        )
    )
    story.append(Spacer(1, 1.5 * mm))
    story.extend(
        project_block(
            "Fleet Operations Core",
            "Central service for fleet workflows, interactive lookup, operational statistics, "
            "service integration, and document generation.",
            [
                "Developed REST APIs, relational queries, and workflow-oriented use cases.",
                "Integrated related services through REST and gRPC and contributed to Kafka event paths.",
                "Applied Redis for explicit cache and short-lived workflow state.",
            ],
            "Java 17, Spring Boot, REST, gRPC, Kafka, Redis, Elasticsearch, Docker",
        )
    )
    story.append(Spacer(1, 3.5 * mm))
    story.extend(
        project_block(
            "Fleet Administration and Dispatch",
            "Administration service for planning, resources, devices, configuration, and operational coordination.",
            [
                "Developed APIs and validation for planning, resource, device, and configuration flows.",
                "Worked on lifecycle and assignment-state queries, caching, and coordination.",
                "Supported event integration, service-to-service calls, reports, and exports.",
            ],
            "Java 17, Spring Boot, REST, gRPC, Kafka, Redis, ShedLock, Docker",
        )
    )
    story.append(Spacer(1, 3.5 * mm))
    story.extend(
        project_block(
            "Fleet Data Intelligence Hub",
            "Read-oriented service for multi-source synchronization, aggregation, operational search, "
            "and normalized lookup.",
            [
                "Built synchronization workers and Kafka consumer flows for approved data sources.",
                "Developed lookup and aggregation APIs with REST and gRPC boundaries.",
                "Worked on Elasticsearch query paths, data processing, and integration-state handling.",
            ],
            "Java 17, Spring Boot, Kafka, Elasticsearch, MongoDB, gRPC, Docker",
        )
    )

    story.extend(section("Earlier Projects"))
    earlier_projects = [
        (
            "Academic Blog at FPTU",
            "Led team delivery, coordinated documentation, designed the database, and implemented "
            "backend APIs.",
            "ASP.NET REST API, SQL Server",
        ),
        (
            "FPT Software Academy Training Management System",
            "Designed database structures, implemented CRUD features, tested functionality, and fixed defects.",
            "Spring Boot, MySQL",
        ),
        (
            "Contract Management System",
            "Contributed to database and REST API design, built full-stack features, and supported deployment.",
            "ASP.NET REST API, React, SQL Server",
        ),
    ]
    for name, description, stack in earlier_projects:
        story.append(
            Paragraph(
                f"<b>{name}</b> - {description} <font color='#52616B'>({stack})</font>",
                STYLES["body"],
            )
        )

    story.extend(section("Certifications and Languages"))
    certifications = [
        "Web Design for Everybody: Basics of Web Development and Coding",
        "Software Development Lifecycle",
        "CertNexus Certified Ethical Emerging Technologist",
        "Google Project Management",
    ]
    cert_table = Table(
        [
            [
                Paragraph("<b>Certifications</b><br/>" + "<br/>".join(certifications), STYLES["small"]),
                Paragraph(
                    "<b>English</b><br/>Intermediate - able to communicate and read technical documentation",
                    STYLES["small"],
                ),
                Paragraph(
                    "<b>Work Modes</b><br/>Onsite, hybrid, or remote<br/><br/><b>Status</b><br/>Open to work and freelance projects",
                    STYLES["small"],
                ),
            ]
        ],
        colWidths=[82 * mm, 48 * mm, 44 * mm],
    )
    cert_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PANEL),
                ("BOX", (0, 0), (-1, -1), 0.5, LIGHT),
                ("INNERGRID", (0, 0), (-1, -1), 0.35, LIGHT),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    story.append(cert_table)
    return story


def generate():
    OUTPUT_PDF.parent.mkdir(parents=True, exist_ok=True)
    document = SimpleDocTemplate(
        str(OUTPUT_PDF),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=14 * mm,
        bottomMargin=17 * mm,
        title="Nguyen Thanh Tam - Middle Backend Developer CV",
        author="Nguyen Thanh Tam",
        subject="Backend Developer CV",
    )
    document.build(build_story(), onFirstPage=draw_page, onLaterPages=draw_page)
    shutil.copy2(OUTPUT_PDF, PUBLIC_PDF)
    print(f"Generated {OUTPUT_PDF}")
    print(f"Updated {PUBLIC_PDF}")


if __name__ == "__main__":
    generate()
