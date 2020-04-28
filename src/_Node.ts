export class Node {
    id: number;
    parent: number;
    children: number[];
    title: string;
    type: string
    ancestor: string

    constructor(id: number, parent: number, children: number[], title: string, type: string, ancestor: string) {
        this.id = id;
        this.parent = parent;
        this.children = children;
        this.title = title;
        this.type = type;
        this.ancestor = ancestor;
    }
}

//
