import { create_blog, NewBlog, RouterContext } from "../deps.ts";

type BlogInput = Omit<Partial<NewBlog>, "create_by">;

/**
 * 处理新建blog请求
 */
export async function create_new_blog(
  ctx: RouterContext<
    "/blog",
    Record<string | number, string | undefined>,
    Record<string, any>
  >,
) {
  let body_ref: BlogInput = {};
  try {
    const body: BlogInput = await ctx.request.body({ type: "json" }).value;
    body_ref = body;
    const { valid, msg } = chenck_input_blog_info(body);
    if (valid) {
      const blog_id = await create_blog({
        title: body.title?.trim() || "",
        summary: body.summary?.trim() || "",
        category_id: body.category_id?.trim() || "",
        tags: body.tags?.trim() || undefined,
        content: body.content?.trim() || "",
        create_by: "c41768b8-7dd9-4819-8653-f036f6f05768",
      });
      ctx.response.body = {
        success: true,
        data: blog_id,
      };
    } else {
      ctx.response.body = {
        success: false,
        msg,
      };
    }
  } catch {
    console.error("create new blog fail with: %O", body_ref);
    ctx.response.body = {
      success: false,
      msg: "服务器错误",
    };
  }
}

function chenck_input_blog_info(
  body: BlogInput,
): { valid: boolean; msg?: string } {
  let valid = true;
  let msg = "";
  if (!body) {
    valid = false;
    msg = "参数必填";
  } else if (!(body.title?.trim())) {
    valid = false;
    msg = "标题不能为空";
  } else if (!(body.category_id?.trim())) {
    valid = false;
    msg = "分类不能为空";
  } else if (!(body.summary?.trim())) {
    valid = false;
    msg = "简介不能为空";
  } else if (!(body.content?.trim())) {
    valid = false;
    msg = "内容不能为空";
  }
  return { valid, msg };
}
