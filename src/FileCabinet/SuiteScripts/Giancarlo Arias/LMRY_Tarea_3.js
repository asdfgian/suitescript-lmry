/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(
    ['N/https', 'N/log', 'N/ui/serverWidget'],
    (https, log, serverWidget) => {
        //url = https://tstdrv1749318.app.netsuite.com/app/site/hosting/scriptlet.nl?script=5956&deploy=1
        const onRequest = (scriptContext) => {
            const { request, response } = scriptContext;

            if (request.method === "GET") {

                const form = serverWidget.createForm({ title: "Movies Search" });

                form.addFieldGroup({
                    id: "custpage_form",
                    label: "Formulario",
                });

                const searchField = form.addField({
                    id: "custpage_search",
                    type: serverWidget.FieldType.TEXT,
                    label: "Search",
                    container: "custpage_form",
                });
                searchField.isMandatory = true

                const yearField = form.addField({
                    id: "custpage_year",
                    type: serverWidget.FieldType.TEXT,
                    label: "Año",
                    container: "custpage_form",
                });
                yearField.isMandatory = true;
                yearField.maxLength = 4;

                form.addSubmitButton({ label: "Buscar" });

                response.writePage({ pageObject: form });

            } else if (request.method === "POST") {

                const search = request.parameters.custpage_search || "";
                const year = request.parameters.custpage_year || "";

                let results = [];
                let page = 1;

                while (page <= 5) {
                    const url = `https://www.omdbapi.com/?apikey=40c70cc8&s=${search}&y=${year}&page=${page}`;
                    log.debug({
                        title: "URL",
                        details: url
                    })

                    const response = https.get({ url: url })

                    const data = JSON.parse(response.body)

                    if (data.Search) {
                        results = results.concat(data.Search);
                    } else {
                        break;
                    }
                    page++;
                }

                if (results.length == 0) {
                    alert("No se encontraron resultados. Ajuste los filtros")
                }

                if (results.length > 50) {
                    alert("La búsqueda devolvió más de 50 resultados. Ajuste los filtros.")
                }

                const form = serverWidget.createForm({ title: "Resultado de Búsqueda" });

                if (results.length > 0 && results.length <= 50) {

                    const sublist = form.addSublist({
                        id: "custpage_results",
                        label: "Resultados",
                        type: serverWidget.SublistType.LIST
                    });

                    sublist.addField({
                        id: "custpage_title",
                        type: serverWidget.FieldType.TEXT,
                        label: "Título"
                    });

                    sublist.addField({
                        id: "custpage_year_col",
                        type: serverWidget.FieldType.TEXT,
                        label: "Año"
                    });

                    sublist.addField({
                        id: "custpage_type_col",
                        type: serverWidget.FieldType.TEXT,
                        label: "Tipo"
                    });

                    sublist.addField({
                        id: "custpage_imdb",
                        type: serverWidget.FieldType.URL,
                        label: "IMDB"
                    });

                    results.forEach((item, index) => {
                        sublist.setSublistValue({
                            id: "custpage_title",
                            line: index,
                            value: item.Title
                        });
                        sublist.setSublistValue({
                            id: "custpage_year_col",
                            line: index,
                            value: item.Year
                        });
                        sublist.setSublistValue({
                            id: "custpage_type_col",
                            line: index,
                            value: item.Type
                        });
                        sublist.setSublistValue({
                            id: "custpage_imdb",
                            line: index,
                            value: `https://www.imdb.com/title/${item.imdbID}`
                        });
                    });
                }

                form.addButton({
                    id: "custpage_back",
                    label: "Volver",
                    functionName: "history.back()"
                });

                response.writePage({ pageObject: form });
            }
        };

        return { onRequest };

    });