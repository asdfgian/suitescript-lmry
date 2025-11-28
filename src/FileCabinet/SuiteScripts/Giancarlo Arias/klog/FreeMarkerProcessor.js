/**
 * @NApiVersion 2.1
 * @author Giancarlo Arias
 */

define(["N/render", "N/file", "N/log"], (render, file, log) => {
    /**
     * FreeMarkerProcessor
     * Utility class to load FreeMarker templates and render PDF/XLS files using NetSuite Render Module.
     */
    class FreeMarkerProcessor {
        /**
         * Initializes a new renderer instance.
         */
        constructor() {
            this.renderer = render.create();
            this.templateId = null;
            this.data = null;
            this.dataType = null;
            this.alias = "data";
        }

        /**
         * Sets the FreeMarker template file ID.
         * @param {string|number} id - File ID in the File Cabinet.
         */
        setTemplateId(id) {
            this.templateId = id;
        }

        /**
         * Defines the data type used for the renderer.
         * Supports "json" or "object".
         * @param {string} type
         */
        setDataType(type) {
            this.dataType = type;
        }

        /**
         * Sets the alias under which the data source will be accessible in the FreeMarker template.
         * @param {string} alias
         */
        setAlias(alias) {
            this.alias = alias;
        }

        /**
         * Sets the data that will be injected into the template.
         * @param {Object} data
         */
        setData(data) {
            this.data = data;
        }

        _process() {
            try {
                if (!this.templateId) throw new Error("Template ID not set.");

                const templateFile = file.load({ id: this.templateId });
                this.renderer.templateContent = templateFile.getContents();

                if (!this.dataType)
                    throw new Error("Data type not specified. Use setDataType().");

                if (!this.data) throw new Error("Data not set. Use setData().");

                if (this.dataType === "json") {
                    this.renderer.addCustomDataSource({
                        format: render.DataSource.JSON,
                        alias: this.alias,
                        data: JSON.stringify(this.data),
                    });
                }

                if (this.dataType === "object") {
                    this.renderer.addCustomDataSource({
                        format: render.DataSource.OBJECT,
                        alias: this.alias,
                        data: this.data,
                    });
                }
            } catch (e) {
                log.error("FreeMarkerProcessor Error (process)", e);
                throw e;
            }
        }

        /**
         * Renders the current FreeMarker template into a PDF file.
         * @param {string} fileName - Output PDF file name without extension.
         */
        renderToPDF(fileName) {
            try {
                this._process();

                const pdf = this.renderer.renderAsPdf();
                pdf.name = `${fileName}.pdf`;

                return pdf;
            } catch (e) {
                log.error("FreeMarkerProcessor Error (PDF)", e);
                throw e;
            }
        }

        /**
         * Renders the current FreeMarker template into an Excel XML Spreadsheet (.xls).
         * @param {string} fileName - Output file name without extension.
         */
        renderToExcel(fileName) {
            try {
                this._process();

                const excelString = this.renderer.renderAsString();

                const excelFile = file.create({
                    name: `${fileName}.xls`,
                    fileType: file.Type.XMLDOC,
                    contents: excelString,
                });

                return excelFile;
            } catch (e) {
                log.error("FreeMarkerProcessor Error (Excel)", e);
                throw e;
            }
        }
    }

    return new FreeMarkerProcessor();
});
