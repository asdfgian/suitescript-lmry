<?xml version="1.0" encoding="UTF-8"?>
<pdf>
    <head>
        <style type="text/css">
            body {
                font-family: Arial, sans-serif;
                font-size: 11px;
                color: #000000;
            }

            .header-title {
                font-size: 20px;
                font-weight: bold;
                border-bottom: 1px solid #000000;
                padding-bottom: 5px;
                margin-bottom: 10px;
            }

            .subtext {
                font-size: 11px;
                color: #555555;
            }

            .box {
                border: 1px solid #000000;
                padding: 8px;
                margin-top: 10px;
            }

            .section-title {
                font-size: 14px;
                font-weight: bold;
                margin-top: 15px;
                border-bottom: 1px solid #000000;
                padding-bottom: 3px;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 8px;
            }

            th {
                background-color: #DDDDDD;
                font-size: 11px;
                padding: 5px;
                border: 1px solid #000000;
            }

            td {
                padding: 5px;
                border: 1px solid #000000;
                font-size: 11px;
            }

            .amount {
                text-align: right;
                font-weight: bold;
            }

            .label {
                font-weight: bold;
            }

            .total-box {
                border: 1px solid #000000;
                padding: 8px;
                margin-top: 10px;
                background-color: #F2F2F2;
            }

            .footer {
                margin-top: 20px;
                font-size: 10px;
                text-align: center;
                color: #666666;
            }
        </style>
    </head>

    <body>

        <div class="header-title">${jsonData.report.title}</div>
        <div class="subtext">${jsonData.report.description}</div>

        <table class="box">
            <tr>
                <td class="label">Fecha de Generación:</td>
                <td>${jsonData.report.generatedDate}</td>
            </tr>
            <tr>
                <td class="label">Total de Clientes:</td>
                <td>${jsonData.summary.totalCustomers}</td>
            </tr>
            <tr>
                <td class="label">Total de Transacciones:</td>
                <td>${jsonData.summary.totalTransactions}</td>
            </tr>
        </table>

        <#if jsonData.customerData?? && jsonData.customerData?size gt 0>
            <div class="section-title">Resumen de Clientes y Transacciones</div>

            <#list jsonData.customerData as customerItem>

                <!-- Datos del Cliente -->
                <div class="box">
                    <div class="label">${customerItem.customer.nombre}</div>
                    <div>Empresa: ${customerItem.customer.empresa}</div>
                    <div>Email: ${customerItem.customer.email}</div>
                    <div>Ciudad: ${customerItem.customer.ciudad}</div>
                </div>

                <!-- Tabla de Transacciones -->
                <#if customerItem.transactions?? && customerItem.transactions?size gt 0>
                    <table>
                        <thead>
                            <tr>
                                <th>ID Transacción</th>
                                <th>Fecha</th>
                                <th>Descripción</th>
                                <th>Monto</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <#list customerItem.transactions as transaction>
                                <tr>
                                    <td>${transaction.id}</td>
                                    <td>${transaction.fecha}</td>
                                    <td>${transaction.descripcion}</td>
                                    <td class="amount">${transaction.monto?string("0.00")} €</td>
                                    <td>${transaction.estado}</td>
                                </tr>
                            </#list>
                        </tbody>
                    </table>

                    <div class="total-box">
                        <span class="label">Subtotal (${customerItem.transactionCount} transacciones):</span>
                        ${customerItem.total?string("0.00")} €
                    </div>

                <#else>
                    <div class="box">
                        <span class="label">Sin transacciones registradas para este cliente</span>
                    </div>
                </#if>

            </#list>

        <#else>
            <div class="box">
                <span class="label">No hay datos de clientes disponibles</span>
            </div>
        </#if>

        <div class="total-box">
            <span class="label">Total General:</span> ${jsonData.summary.grandTotalFormatted}
        </div>

        <div class="footer">
            Este reporte fue generado automáticamente por NetSuite<br/>
            Proyecto de Práctica - FreeMarker Learning
        </div>

    </body>
</pdf>