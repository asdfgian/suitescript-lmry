/**
 * @NApiVersion 2.1
 */
define(
    ["N/log"],
    (log) => {

        /**
         * Formatea un número como moneda
         * @param {number} valor - Monto a formatear
         * @param {string} [simbolo='€'] - Símbolo de moneda
         * @returns {string} Valor formateado con 2 decimales
         */
        function formatCurrency(valor, simbolo) {
            simbolo = simbolo || "€";

            if (typeof valor !== "number") {
                return "0.00 " + simbolo;
            }

            var formattedValue = valor.toFixed(2);
            return formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " " + simbolo;
        }

        /**
         * Capitaliza la primera letra de una cadena
         * @param {string} texto - Texto a capitalizar
         * @returns {string} Texto con primera letra en mayúscula
         */
        function capitalize(texto) {
            if (!texto || typeof texto !== "string") {
                return "";
            }
            return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
        }

        /**
         * Registra un error de forma segura
         * @param {string} title - Título del error
         * @param {Error|string} error - Error o mensaje
         */
        function logError(title, error) {
            try {
                var details = error instanceof Error ? error.message : String(error);
                log.error({ title: title, details: details });
            } catch (e) {
                // Fallback silencioso
            }
        }

        /**
         * Registra información de forma segura
         * @param {string} title - Título
         * @param {string} details - Detalles
         */
        function logInfo(title, details) {
            try {
                log.debug({ title: title, details: details });
            } catch (e) {
            }
        }

        return {
            formatCurrency: formatCurrency,
            capitalize: capitalize,
            logError: logError,
            logInfo: logInfo
        };
    });
