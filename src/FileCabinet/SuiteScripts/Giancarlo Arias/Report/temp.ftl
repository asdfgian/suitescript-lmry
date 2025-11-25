<?xml version="1.0"?>
<!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">
<pdf>
    <head>
        <style>
            body { font-family: Arial; }

            .header {
                background-color: #2c3e50;
                color: #ffffff;
                padding: 10px;
            }

            .summary {
                background-color: #ecf0f1;
                padding: 8px;
            }

            table {
                width: 100%;
            }

            th {
                font-weight: bold;
                border-bottom: 1px solid #000000;
            }

            td {
                border-bottom: 1px solid #cccccc;
            }

            .low-stock {
                background-color: #ffebee;
            }

            .high-value {
                font-weight: bold;
                color: #27ae60;
            }
        </style>
    </head>

    <body>

        <table class="header">
            <tr>
                <td>
                    <p style="font-size:18px; font-weight:bold;">Reporte de Inventario</p>
                    <p>Generado: ${fechaGeneracion?string("dd/MM/yyyy HH:mm")}</p>
                </td>
            </tr>
        </table>

        <table class="summary">
            <tr><td><p><b>Total Items:</b> ${totalItems}</p></td></tr>
            <tr><td><p><b>Valor Total Inventario:</b> $${valorTotalInventario?string(",##0.00")}</p></td></tr>
            <tr><td><p><b>Items con Stock Bajo:</b> ${totalStockBajo}</p></td></tr>
        </table>

        <p style="font-size:16px; font-weight:bold;">Detalle de Items</p>

        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Stock Disponible</th>
                    <th>Precio Unitario</th>
                    <th>Valor Total</th>
                </tr>
            </thead>

            <tbody>
                <#list items as item>
                    <tr class="${(item.stockDisponible < 10)?then('low-stock', '')}">
                        <td>${item.nombre}</td>
                        <td>${item.categoria!"Sin categoría"}</td>
                        <td>${item.stockDisponible}</td>
                        <td>$${item.precio?string(",##0.00")}</td>
                        <td class="${(item.valorTotal > 10000)?then('high-value', '')}">
                            $${item.valorTotal?string(",##0.00")}
                        </td>
                    </tr>
                </#list>
            </tbody>
        </table>

        <#if items?size == 0>
            <p style="text-align:center; margin-top:20px; color:#7f8c8d;">
                No se encontraron items para mostrar.
            </p>
        </#if>

    </body>
</pdf>
