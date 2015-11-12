///<reference path="../../../references.ts"/>

class MasterDetailRenderer implements JSONForms.IRenderer {

    priority = 1;

    constructor(private renderService: JSONForms.IRenderService) { }

    render(element: IUISchemaElement, subSchema: SchemaElement, schemaPath: string, services: JSONForms.Services): JSONForms.IContainerRenderDescription {
        var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath, services, "");
        var template = `
        <div class="row">
            <!-- Master -->
            <div class="col-sm-30">
                <masterdetail-collection element="element" collection="element.schema.properties"></masterdetail-collection>
            </div>
            <!-- Detail -->
            <div class="col-sm-70">
                <jsonforms schema="element.selectedSchema" data="element.selectedChild" ng-if="element.selectedChild"></jsonforms>
            </div>
        </div>
        `;
        control['template'] = template;
        control['schema']=subSchema;
        control['filter']=(properties) => {
            var result = {};
            angular.forEach(properties, (value, key) => {
                if (value.type=='array' && value.items.type=='object') {
                    result[key] = value;
                }
            });
        }
        return control;
    }

    isApplicable(uiElement: IUISchemaElement, jsonSchema: SchemaElement, schemaPath): boolean {
        return uiElement.type == "MasterDetailLayout" && jsonSchema !== undefined && jsonSchema.type == 'object';
    }
}

angular.module('jsonforms.renderers.layouts.masterdetail').run(['RenderService', (RenderService) => {
    RenderService.register(new MasterDetailRenderer(RenderService));
}]);
