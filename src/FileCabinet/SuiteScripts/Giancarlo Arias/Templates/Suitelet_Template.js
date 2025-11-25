/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(["N/log", "./SuiteletComponent"], (log, suiteletComponent) => {
    const businessLogic = (context, params) => {
        // Lógica real: crear/actualizar registros, validaciones complejas, llamadas a otros módulos, etc.

        // const rec = record.create({ type: 'customrecord_mi_registro' });
        // rec.setValue({ fieldId: 'name', value: params.CUSTOMER_NAME });
        // rec.setValue({ fieldId: 'custrecord_notas', value: params.SUBMIT_NOTES });
        // const id = rec.save();

        log.audit({
            title: "Business Logic executed",
            details: `Customer: ${params.customer}`,
        });
    };

    const suiteInstance = suiteletComponent.create({
        params: {
            customer: {
                id: "custpage_customer_name",
                label: "Customer Name",
                helpText: "Enter the full name of the customer"
            },
            vendor: {
                id: "custpage_vendor_name",
                label: "Vendor Name",
                helpText: "Enter the full name of the vendor"
            }
        },
        clientScriptModulePath: null,
        onProcessPost: businessLogic,
    });

    onRequest = (context) => {
        suiteInstance.onRequest(context);
    };

    return {
        onRequest: onRequest,
    };
});
