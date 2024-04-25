export interface ColumnProps {
    id:string,
    name:string | undefined,
    key:string | undefined,
}

export interface ColumnWrapProps {
    id:string,
    tables:ColumnProps[]
}