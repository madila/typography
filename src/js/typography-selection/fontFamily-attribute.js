import {assign} from 'lodash';
const { addFilter } = wp.hooks;
const { __ } = wp.i18n;

// Enable spacing control on the following blocks
export const enableTypographyControlOnBlocks = [
    'core/paragraph',
];

// Available spacing control options
export const typographyControlOptions = [
    {
        label: __( 'None' ),
        value: '',
    },
    {
        label: __( 'Inherit' ),
        value: 'inherit',
    },
];

/**
 * Add spacing control attribute to block.
 *
 * @param {object} settings Current block settings.
 * @param {string} name Name of block.
 *
 * @returns {object} Modified block settings.
 */
export const addTypographyControlAttribute = ( settings, name ) => {
    // Do nothing if it's another block than our defined ones.
    if ( ! enableTypographyControlOnBlocks.includes( name ) ) {
        return settings;
    }

    // Use Lodash's assign to gracefully handle if attributes are undefined
    settings.attributes = assign( settings.attributes, {
        fontFamily: {
            type: 'string',
            default: typographyControlOptions[ 0 ].value,
        },
    } );

    return settings;
};

addFilter( 'blocks.registerBlockType', 'typography/attribute', addTypographyControlAttribute );