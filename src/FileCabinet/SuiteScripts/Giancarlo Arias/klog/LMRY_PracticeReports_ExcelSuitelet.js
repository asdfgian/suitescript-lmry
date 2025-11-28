/**
 *@NApiVersion 2.1
 *@NScriptType Suitelet
 */
define(["N/ui/serverWidget", "N/search", "N/log", "./FreeMarkerProcessor"], (
    serverWidget,
    search,
    log,
    freeMarkerProcessor
) => {
    /**
     * @param {Object} scriptContext
     * @param {import("N/http").ServerRequest} scriptContext.request - Incoming request
     * @param {import("N/http").ServerResponse} scriptContext.response - Suitelet response
     */
    const doGet = (scriptContext) => {
        const form = serverWidget.createForm({
            title: "Exportar Saved Search a XLS",
            hideNavBar: false,
        });

        form.addField({
            id: "custpage_search",
            type: serverWidget.FieldType.INTEGER,
            label: "Saved Search ID",
        });

        form.addSubmitButton({ label: "Generar XLS" });

        scriptContext.response.writePage(form);
    };

    /**
     * @param {Object} scriptContext
     * @param {import("N/http").ServerRequest} scriptContext.request - Incoming request
     * @param {import("N/http").ServerResponse} scriptContext.response - Suitelet response
     * @since 2015.2
     */
    const doPost = (scriptContext) => {
        const savedSearchId = scriptContext.request.parameters["custpage_search"];

        const savedSearchResults = getSavedSearchResults(loadSearch(savedSearchId));

        const searchData = {
            title: "Reporte",
            columns: savedSearchResults.columns,
            rows: savedSearchResults.rows,
        };

        //@ts-ignore
        freeMarkerProcessor.setTemplateId(
            "./FreeMarker-Templates/practice-reports-excel.ftl"
        );
        //@ts-ignore
        freeMarkerProcessor.setDataType("object");
        //@ts-ignore
        freeMarkerProcessor.setAlias("data");

        const fixedRows = searchData.rows.map((r) => {
            return { cols: r };
        });

        const fixedData = {
            title: searchData.title,
            columns: searchData.columns,
            rows: fixedRows,
        };

        //@ts-ignore
        freeMarkerProcessor.setData(fixedData);
        //@ts-ignore
        const excel = freeMarkerProcessor.renderToExcel("report");

        scriptContext.response.writeFile({
            file: excel,
        });
    };

    const getSavedSearchResults = (savedSearch) => {
        const result = { rows: [], columns: [] };

        savedSearch.columns.forEach((column) => {
            //@ts-ignore
            result.columns.push(column.label || column.name || column);
        });

        savedSearch.rows.forEach((savedSearchResult) => {
            const row = [];
            savedSearch.columns.forEach((column) => {
                const columnName =
                    typeof column === "object" && column.name ? column.name : column;
                row.push(savedSearchResult.getValue({ name: columnName }) || "");
            });
            //@ts-ignore
            result.rows.push(row);
        });

        return result;
    };

    const loadSearch = (searchId) => {
        const savedSearch = search.load({ id: searchId });

        let result = [];
        let start = 0;
        const pageSize = 1000;

        do {
            const results = savedSearch.run().getRange({
                start: start,
                end: start + pageSize,
            });

            result = result.concat(results);
            start += pageSize;

            if (!results || results.length < pageSize) break;
        } while (true);

        return {
            columns: savedSearch.columns,
            rows: result,
        };
    };

    return {
        onRequest: function (context) {
            if (context.request.method === "GET") doGet(context);
            else doPost(context);
        },
    };
});
