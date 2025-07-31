import { HttpResponse, http } from 'msw'
import { setupServer, SetupServerApi } from 'msw/node'

/**
 * Creates mocked GoogleAPI server that returns CSS data for material symbols.
 *
 * @param invalid_icons_names Names of not existing icons that would be resolved into fallback.
 */
const defineMockedGoogleApiResponses = (invalid_icons_names: string[]): SetupServerApi => {
    return setupServer(
        http.get('https://fonts.googleapis.com/css2', ({ request }) => {
            const url = new URL(request.url)
            const iconName = url.searchParams.get('icon_names')

            if (iconName == null || invalid_icons_names.includes(iconName)) {
                return HttpResponse.text(
                    `
            /* fallback */
            @font-face {
            font-family: 'Material Symbols Outlined';
            font-style: normal;
            font-weight: 100 700;
            src: url(https://fonts.gstatic.com/s/materialsymbolsoutlined/v135/kJEhBvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oDMzByHX9rA6RzaxHMPdY.woff2) format('woff2');
            }`,
                    {
                        headers: { 'Content-Type': 'text/css' }
                    }
                )
            }

            return HttpResponse.text(
                `
        @font-face {
            font-family: 'Material Symbols Outlined';
            font-style: normal;
            font-weight: 100 700;
            src: url(https://fonts.gstatic.com/s/materialsymbolsoutlined/v135/kJEhBvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oDMzByHX9rA6RzaxHMPdY.woff2) format('woff2');
        }
        .material-symbols-outlined {
            font-family: 'Material Symbols Outlined';
            font-weight: normal;
            font-style: normal;
            font-size: 24px;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
            display: inline-block;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
        }`,
                {
                    headers: { 'Content-Type': 'text/css' }
                }
            )
        })
    )
}

export default defineMockedGoogleApiResponses
