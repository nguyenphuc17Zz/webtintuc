export interface user {
    user_id:number;
    username:string;
    email:string;
    password:string;
    role:string;
    created_at:Date;
    status:boolean;
}
export interface category{
    category_id:number;
    category_name:string;
    description:string;
    image_cate:string;
    status:boolean;
}
export interface tag{
    tag_id:number;
    tag_name:string;
    status:boolean
}