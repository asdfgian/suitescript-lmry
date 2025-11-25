/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/render', 'N/log', 'N/file'],

    (render, log, file) => {

        const beforeLoad = (context) => {
            //if (context.type !== context.UserEventType.VIEW) return;

            const { newRecord, type, form, request } = context;

            try {
                const templateData = {
                    fechaGeneracion: new Date(),
                    items: [
                        { nombre: 'Item A', categoria: 'Categoria 1', stockDisponible: 5, precio: 100, valorTotal: 500 },
                        { nombre: 'Item B', categoria: 'Categoria 2', stockDisponible: 20, precio: 50, valorTotal: 1000 },
                        { nombre: 'Item C', categoria: 'Categoria 1', stockDisponible: 8, precio: 200, valorTotal: 1600 }
                    ],
                    totalItems: 3,
                    valorTotalInventario: 3100,
                    totalStockBajo: 2
                };

                const templateFile = file.load({
                    id: './temp.ftl'
                });
                const renderer = render.create();
                renderer.templateContent = templateFile.getContents();

                renderer.addCustomDataSource({
                    format: render.DataSource.OBJECT,
                    alias: 'data',
                    data: templateData
                });

                const reportFile = renderer.renderAsPdf();

                reportFile.folder = 403423;
                reportFile.name = 'Reporte_Inventario_' + new Date().toISOString().split('T')[0] + '.pdf';

                const fileId = reportFile.save();

                form.addButton({
                    id: 'custpage_view_report',
                    label: 'Ver Reporte de Inventario',
                    functionName: 'generate("' + fileId + '")'
                });

                form.clientScriptModulePath = './LMRY_CLNT.js';

            } catch (e) {
                log.error('Error generando reporte', e);
            }
        }

        return { beforeLoad }

    });
