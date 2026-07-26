import io
import csv
import pandas as pd
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func, distinct
from fastapi import HTTPException, status
from fastapi.responses import Response, JSONResponse

from backend.app.models.material import Material


class ReportService:
    @staticmethod
    def _export_data(data: List[Dict[str, Any]], format_type: str, filename_prefix: str) -> Response:
        fmt = format_type.lower()
        if fmt == "json":
            return JSONResponse(content=data)
        elif fmt == "csv":
            if not data:
                return Response(
                    content="",
                    media_type="text/csv",
                    headers={"Content-Disposition": f"attachment; filename={filename_prefix}.csv"},
                )
            output = io.StringIO()
            writer = csv.DictWriter(output, fieldnames=data[0].keys())
            writer.writeheader()
            writer.writerows(data)
            return Response(
                content=output.getvalue(),
                media_type="text/csv",
                headers={"Content-Disposition": f"attachment; filename={filename_prefix}.csv"},
            )
        elif fmt == "excel":
            output = io.BytesIO()
            df = pd.DataFrame(data)
            with pd.ExcelWriter(output, engine="openpyxl") as writer:
                df.to_excel(writer, index=False, sheet_name="Report")
            return Response(
                content=output.getvalue(),
                media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                headers={"Content-Disposition": f"attachment; filename={filename_prefix}.xlsx"},
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported format '{format_type}'. Allowed formats: json, csv, excel.",
            )

    @staticmethod
    def generate_material_report(db: Session, format_type: str = "json") -> Response:
        materials = db.query(Material).all()
        data = []
        for m in materials:
            data.append({
                "ID": m.id,
                "Material Name": m.material_name,
                "Type": m.material_type,
                "Manufacturer": m.manufacturer or "",
                "Category": m.category or "",
                "Status": m.status,
                "Health Score": m.health_score,
                "Carbon Score": m.carbon_score,
                "Recyclable": m.is_recyclable,
                "Location": m.location or "",
            })
        return ReportService._export_data(data, format_type, "materials_report")

    @staticmethod
    def generate_health_report(db: Session, format_type: str = "json") -> Response:
        materials = db.query(Material).all()
        data = []
        for m in materials:
            data.append({
                "Material Name": m.material_name,
                "Manufacturer": m.manufacturer or "",
                "Health Score": m.health_score,
                "Status": m.status,
            })
        return ReportService._export_data(data, format_type, "health_report")

    @staticmethod
    def generate_carbon_report(db: Session, format_type: str = "json") -> Response:
        materials = db.query(Material).all()
        data = []
        for m in materials:
            data.append({
                "Material Name": m.material_name,
                "Manufacturer": m.manufacturer or "",
                "Carbon Score": m.carbon_score,
                "Recyclable": m.is_recyclable,
            })
        return ReportService._export_data(data, format_type, "carbon_report")

    @staticmethod
    def generate_manufacturer_report(db: Session, format_type: str = "json") -> Response:
        results = (
            db.query(
                Material.manufacturer,
                func.count(Material.id).label("total_materials"),
                func.avg(Material.health_score).label("avg_health_score"),
                func.avg(Material.carbon_score).label("avg_carbon_score"),
            )
            .group_by(Material.manufacturer)
            .all()
        )
        data = []
        for r in results:
            data.append({
                "Manufacturer": r.manufacturer or "Unknown",
                "Total Materials": r.total_materials,
                "Average Health Score": round(float(r.avg_health_score or 0), 2),
                "Average Carbon Score": round(float(r.avg_carbon_score or 0), 2),
            })
        return ReportService._export_data(data, format_type, "manufacturer_report")
