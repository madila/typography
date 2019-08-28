const {createHigherOrderComponent} = wp.compose;
const {addFilter} = wp.hooks;
const {Fragment} = wp.element;
const { __ } = wp.i18n;
const {InspectorControls, BlockEdit} = wp.editor;
const {PanelBody, SelectControl} = wp.components;

import {addTypographyControlAttribute, typographyControlOptions} from './fontFamily-attribute';

/**
 * Create HOC to add spacing control to inspector controls of block.
 */
const withFontFamilyControl = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        // Do nothing if it's another block than our defined ones.
        if (!addTypographyControlAttribute.includes(props.name)) {
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