export class ATTRIBUTE {
  constructor(
    public readonly attribute_id: string, 
    public readonly attribute_spu_id: string, 
    public readonly attribute_name: string,  
    public readonly attribute_slug: string, 
    public readonly attribute_type: "text" | "number" | "boolean" | "array",
    public readonly attribute_category: string, 
    public readonly attribute_isRequired: boolean,
    public readonly attribute_status: "active" | "inactive"
  ) {}
}
