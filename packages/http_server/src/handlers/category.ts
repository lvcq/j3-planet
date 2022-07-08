import { NewCategory } from '@database';
import { RouterContext } from '../deps.ts';
import { create_category } from '@category';

type CategoryInput = Partial<Omit<NewCategory, 'create_by'>>;
type Context = RouterContext<"/category", Record<string | number, string | undefined>, Record<string, any>>;


export async function create_new_category(ctx: Context) {
  try {
    const category_input: CategoryInput = await ctx.request.body({ type: 'json' }).value;
    const { valid, msg } = chenck_input_categery(category_input);
    if (valid) {
      const category_id = await create_category({
        name: category_input.name?.trim() || '',
        create_by: "c41768b8-7dd9-4819-8653-f036f6f05768",
      });
      ctx.response.body = {
        success: true,
        data: category_id,
      };
    } else {
      ctx.response.body = {
        success: false,
        msg,
      };
    }
  } catch (e) {
    console.log("ceate new category fail: ", e);
    ctx.response.body = {
      success: false,
      msg: e?.message||e||"创建失败"
    }
  }

}

function chenck_input_categery(category_input: CategoryInput) {
  const result = { valid: true, msg: "" };
  if (!category_input) {
    result.valid = false;
    result.msg = "分类信息不能为空";
  }
  return result;
}