import assign from "lodash/assign";

const {createHigherOrderComponent} = wp.compose;
const {addFilter} = wp.hooks;
const {Fragment} = wp.element;
const { __ } = wp.i18n;
const {InspectorControls, BlockEdit} = wp.editor;
const {PanelBody, SelectControl} = wp.components;

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

/**
 * Create HOC to add spacing control to inspector controls of block.
 */
const withFontFamilyControl = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        // Do nothing if it's another block than our defined ones.
        if (!enableTypographyControlOnBlocks.includes(props.name)) {
            return (
                <BlockEdit {...props} />
            );
        }

        const {fontFamily} = props.attributes;

        // add has-spacing-xy class to block
        if(fontFamily) {
            props.attributes.style = `font-family:${fontFamily}`;
        }

        return (
            <Fragment>
                <BlockEdit {...props} />
                <InspectorControls>
                    <PanelBody
                        title={__('Typography')}
                        initialOpen={true}
                    >
                        <SelectControl
                            label={__('Custom Font Family')}
                            value={fontFamily}
                            options={typographyControlOptions}
                            onChange={(selectedFontFamilyOption) => {
                                props.setAttributes({
                                    fontFamily: selectedFontFamilyOption,
                                });
                            }}
                        />
                    </PanelBody>
                </InspectorControls>
            </Fragment>
        );
    };
}, 'withFontFamilyControl');

addFilter('editor.BlockEdit', 'typography/with-font-family-control', withFontFamilyControl);