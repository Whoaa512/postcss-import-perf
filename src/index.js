import React, { PureComponent } from 'react'
import { render } from 'react-dom'

import ToggleField from '~/components/ToggleField'

function init(doc = document) {
    const div = doc.body.appendElement('div')

    render(<ToggleField />, div)
}
