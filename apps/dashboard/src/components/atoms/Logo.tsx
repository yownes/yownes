import React from "react";
import { Grid } from "antd";

interface LogoProps {
  width?: number;
  height?: number;
}

function Logo({ width = 150, height }: LogoProps) {
  const { md } = Grid.useBreakpoint();
  const vWidth = md ? width : width - (width / 4) * 3;
  return (
    <svg width={vWidth} height={height} viewBox={`0 0 ${vWidth} 52`}>
      <title>{"Artboard"}</title>
      <g fill="none" fillRule="nonzero">
        {md && (
          <path
            d="M46.465 35.43c.2.094.458.183.776.267.318.086.63.127.94.127 1 0 1.78-.23 2.343-.691.564-.463 1.072-1.211 1.526-2.245a81.844 81.844 0 01-3.202-7.19A64.151 64.151 0 0146.382 18h2.726c.2.847.439 1.761.722 2.74a74.474 74.474 0 002.057 6.13 55.49 55.49 0 001.253 2.994 77.023 77.023 0 001.798-5.875c.51-1.94.991-3.936 1.446-5.989H59a116.162 116.162 0 01-2.18 7.98 83.63 83.63 0 01-2.59 7.161c-.363.847-.74 1.577-1.13 2.19a6.55 6.55 0 01-1.294 1.511 4.663 4.663 0 01-1.595.875c-.59.19-1.259.283-2.003.283-.2 0-.409-.013-.626-.043a6.572 6.572 0 01-.641-.113 6.216 6.216 0 01-.572-.155 2.727 2.727 0 01-.369-.141l.465-2.119zM72.216 24.5c0-1.611-.378-2.888-1.133-3.832-.756-.944-1.784-1.414-3.084-1.414s-2.329.47-3.083 1.414c-.756.944-1.134 2.22-1.134 3.832 0 1.613.378 2.89 1.134 3.832.754.944 1.783 1.414 3.083 1.414 1.3 0 2.328-.47 3.084-1.414.755-.943 1.133-2.22 1.133-3.832m2.784 0c0 1.135-.173 2.161-.518 3.076a6.974 6.974 0 01-1.448 2.363 6.343 6.343 0 01-2.223 1.524c-.862.358-1.798.537-2.812.537-1.014 0-1.95-.179-2.811-.537a6.318 6.318 0 01-2.223-1.524 6.953 6.953 0 01-1.449-2.363c-.344-.915-.516-1.94-.516-3.076 0-1.117.172-2.138.516-3.063.344-.925.827-1.716 1.449-2.376a6.318 6.318 0 012.223-1.524c.86-.358 1.797-.537 2.811-.537s1.95.179 2.812.537c.86.356 1.601.864 2.223 1.524.62.66 1.104 1.45 1.448 2.376.345.925.518 1.946.518 3.063M90.801 32a122.472 122.472 0 01-1.686-4.745 78.563 78.563 0 01-1.63-5.553 85.566 85.566 0 01-1.615 5.553c-.585 1.78-1.143 3.36-1.671 4.745h-2.297c-.869-1.98-1.719-4.24-2.55-6.778-.831-2.54-1.616-5.28-2.352-8.222h2.834c.188.903.415 1.884.68 2.941.263 1.059.543 2.118.836 3.173.292 1.059.6 2.078.921 3.059.321.981.624 1.837.906 2.567.322-.903.639-1.86.95-2.87.312-1.009.61-2.03.893-3.058.284-1.029.553-2.038.808-3.029.254-.99.476-1.918.666-2.783h2.182c.17.865.377 1.793.624 2.783a117.198 117.198 0 001.686 6.088c.31 1.01.627 1.966.95 2.869.283-.73.58-1.586.892-2.567a108.424 108.424 0 001.772-6.232A81.86 81.86 0 0095.28 17H98a120.661 120.661 0 01-2.352 8.222c-.832 2.538-1.682 4.797-2.551 6.778h-2.296zM101 17.734c.609-.151 1.418-.311 2.429-.48 1.01-.17 2.171-.254 3.485-.254 1.181 0 2.162.164 2.943.494.78.33 1.404.79 1.872 1.383.467.594.795 1.305.985 2.133.19.83.286 1.743.286 2.74V32h-2.657v-7.685c0-.903-.062-1.674-.186-2.316-.124-.64-.33-1.158-.614-1.554a2.439 2.439 0 00-1.143-.86c-.476-.18-1.067-.269-1.772-.269-.284 0-.581.01-.885.028a19.71 19.71 0 00-.872.07c-.276.029-.525.062-.742.1-.22.037-.376.066-.472.085V32H101V17.734zM126.222 23.138c.02-1.156-.282-2.106-.902-2.85-.62-.742-1.474-1.113-2.562-1.113-.612 0-1.151.114-1.618.343a3.833 3.833 0 00-1.188.894c-.325.368-.58.79-.76 1.267a6.03 6.03 0 00-.358 1.459h7.388zM116 24.542c0-1.266.19-2.371.572-3.318.383-.943.887-1.728 1.519-2.352a6.202 6.202 0 012.176-1.404 7.038 7.038 0 012.519-.468c2.004 0 3.542.602 4.61 1.803 1.068 1.202 1.604 3.031 1.604 5.49v.427c0 .175-.01.335-.03.482h-10.192c.115 1.486.562 2.614 1.345 3.385.782.77 2.004 1.157 3.665 1.157.936 0 1.723-.078 2.363-.234.64-.156 1.12-.309 1.447-.455l.37 2.147c-.324.165-.892.34-1.704.522-.81.184-1.73.276-2.763.276-1.298 0-2.418-.188-3.363-.564-.945-.377-1.723-.894-2.334-1.556a6.274 6.274 0 01-1.36-2.353c-.297-.908-.444-1.903-.444-2.985M136.387 29.826c1.034 0 1.803-.138 2.302-.414.5-.275.749-.715.749-1.32 0-.624-.245-1.12-.735-1.487-.491-.367-1.3-.78-2.426-1.237a37.025 37.025 0 01-1.566-.675c-.5-.23-.931-.5-1.294-.812a3.514 3.514 0 01-.871-1.128c-.22-.441-.327-.982-.327-1.624 0-1.266.462-2.27 1.388-3.013.927-.743 2.19-1.116 3.787-1.116.4 0 .8.025 1.2.07.4.046.772.102 1.117.165.345.065.65.133.912.207.264.074.468.136.614.192l-.463 2.202c-.273-.147-.7-.298-1.282-.455-.58-.155-1.28-.234-2.098-.234-.707 0-1.326.143-1.853.428-.526.283-.79.729-.79 1.333 0 .312.06.588.178.827s.3.453.544.646c.246.193.55.372.914.537.363.166.799.339 1.309.522.67.257 1.27.51 1.796.758.528.247.978.535 1.35.865.372.332.659.73.858 1.199.2.468.3 1.04.3 1.72 0 1.32-.486 2.32-1.458 2.999-.972.68-2.356 1.019-4.155 1.019-1.254 0-2.234-.107-2.942-.317-.71-.21-1.19-.372-1.445-.481l.463-2.202c.29.11.753.274 1.389.495.637.22 1.48.33 2.535.33"
            fill="#4B4A4B"
          />
        )}
        <path
          d="M36.123 8.426c-2.393-1.354-6.326.593-8.73 4.798-.942 1.647-1.51 3.339-1.716 4.87-.003.022-.011.035-.014.057l-.023.25c-.01.097-.022.196-.03.292-.202 1.943-.649 4.983-.649 4.983l.001.001c-.677 2.742-1.937 5.985-4.22 7.373-1.094.584-1.933.464-2.261.376-.765-.305-1.711-1.02-2.275-2.713-1.059-3.18.42-7.55.42-7.55l-.019.018c.753-2.369.462-4.53-.898-5.299-1.758-.993-4.616.704-6.38 3.792-1.767 3.088-1.772 6.397-.014 7.39.348.198.75.262 1.168.256l-.028.029c2.602.08 3.471.822 4.615 2.593.958 1.484.373 4.705.04 6.157a6.31 6.31 0 00-.146.59l-.039.15.007-.001c-.243 1.349.031 2.503.842 2.96 1.25.707 3.283-.5 4.538-2.696a7.97 7.97 0 00.352-.706c.023-.04.045-.072.07-.126.632-1.41 1.406-3.911 3.843-7.389 1.054-1.503 2.736-3.034 4.305-4.29.098-.08.201-.162.312-.244.011-.01.022-.018.033-.026.79-.585 1.84-1.197 2.286-1.451.07-.04.139-.076.208-.118l.017-.01h-.002c1.546-.944 3.1-2.557 4.326-4.616 2.69-4.514 2.455-8.347.061-9.7M34.252 27.387c-2.337-1.353-6.138.958-8.486 5.162-2.348 4.205-2.356 8.71-.018 10.064 2.339 1.353 6.138-.958 8.486-5.162 2.348-4.205 2.356-8.711.018-10.064"
          fill="#00DC99"
        />
      </g>
    </svg>
  );
}

Logo.defaultProps = {
  width: 150,
  height: 52,
};

export default Logo;
