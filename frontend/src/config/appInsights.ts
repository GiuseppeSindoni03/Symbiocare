import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';

const reactPlugin = new ReactPlugin();
const connectionString = import.meta.env.VITE_APPLICATIONINSIGHTS_CONNECTION_STRING;

const appInsights = new ApplicationInsights({
  config: {
    connectionString: connectionString,
    extensions: [reactPlugin],
    enableAutoRouteTracking: true, // Traccia automaticamente i cambi di route
    disableFetchTracking: false, // Traccia le chiamate API fetch/axios
    enableCorsCorrelation: true, // Collega il frontend al backend per il distributed tracing
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
  }
});

if (connectionString) {
  appInsights.loadAppInsights();
  appInsights.trackPageView(); // Traccia la prima visualizzazione di pagina al caricamento
}

export { appInsights, reactPlugin };
