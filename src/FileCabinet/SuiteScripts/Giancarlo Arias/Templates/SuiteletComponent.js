/**
 * @NApiVersion 2.1
 */
define(["N/log", "N/ui/serverWidget"], (log, serverWidget) => {
    /**
     * Represents a reusable Suitelet component.
     * @class SuiteletComponent
     */
    class SuiteletComponent {
        /**
         * @constructor
         * @param {SuiteletComponentOptions} options - Configuration options for the Suitelet component.
         */
        constructor(options) {
            options = options || {};
            this.params = options.params || {};
            this.clientScriptModulePath = options.clientScriptModulePath || null;
            this.onProcessPost =
                typeof options.onProcessPost === "function"
                    ? options.onProcessPost
                    : null;
        }

        handleGet(context) {
            const form = serverWidget.createForm({ title: "Sample Suitelet" });

            if (this.clientScriptModulePath) {
                form.clientScriptModulePath = this.clientScriptModulePath;
            }

            const customerField = form.addField({
                id: this.params.customer.id,
                type: serverWidget.FieldType.TEXT,
                label: this.params.customer.label
            });
            customerField.isMandatory = true;
            customerField.setHelpText({ help: this.params.customer.helpText });

            const vendorField = form.addField({
                id: this.params.vendor.id,
                type: serverWidget.FieldType.TEXT,
                label: this.params.vendor.label
            });
            vendorField.isMandatory = true

            form.addSubmitButton({ label: "Submit" });

            context.response.writePage(form);
        }


        /**
         * Handles POST requests. It parses request parameters, executes the onProcessPost callback,
         * and writes a success response.
         * @param {Object} context - The Suitelet context provided by the NetSuite platform.
         */
        handlePost(context) {
            try {
                const req = context.request;
                const params = {};

                for (const key in this.params) {
                    if (!Object.prototype.hasOwnProperty.call(this.params, key)) continue;

                    const def = this.params[key] || {};
                    const fieldId = def.id;
                    params[key] = req.parameters[fieldId];
                }

                log.audit({
                    title: "SuiteletComponent POST Received",
                    details: JSON.stringify(params)
                });


                if (this.onProcessPost) {
                    try {
                        this.onProcessPost(context, params);
                    } catch (cbErr) {
                        log.error({ title: "Error in onProcessPost", details: cbErr });
                        throw cbErr;
                    }
                } else {
                    log.debug({ title: "POST processed (default)", details: params });
                }

                context.response.write("Data received successfully.");
            } catch (e) {
                log.error({ title: "Error Processing POST", details: e });
                throw new Error(
                    "An error occurred while processing the request. Check the logs"
                );
            }
        }

        /**
         * The main request handler for the Suitelet. It delegates to handleGet or handlePost
         * based on the HTTP request method.
         * @param {Object} context - The Suitelet context provided by the NetSuite platform.
         */
        onRequest(context) {
            try {
                if (context.request.method === "GET") {
                    this.handleGet(context);
                } else if (context.request.method === "POST") {
                    this.handlePost(context);
                }
            } catch (e) {
                log.error({ title: "SuiteletComponent.onRequest Error", details: e });
                throw "SuiteletComponent.onRequest Error";
            }
        }

        /**
         * Gets the field map for the component.
         * @returns {Object.<string, string>} The configured fields.
         */
        getFields() {
            return this.params;
        }
    }

    return {
        /**
         * Factory function to create a new instance of SuiteletComponent.
         * @param {SuiteletComponentOptions} options - Configuration options for the component.
         * @returns {SuiteletComponent} A new instance of the SuiteletComponent.
         */
        create: function (options) {
            return new SuiteletComponent(options);
        },
    };
});
