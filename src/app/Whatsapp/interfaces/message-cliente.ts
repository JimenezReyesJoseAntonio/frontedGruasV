export interface MessageCliente {
    messaging_product: string;
    to: string;
    type: string;
    template: Template;
}

export interface Template {
    name: string;
    language: Language;
    components: Component[]; // Hacemos que components sea opcional
}

export interface Component {
    type: string;
    parameters?: Parameter[];
}

export interface Parameter {
    type: string;
    text: string;
}

export interface Language {
    code: string;
}
