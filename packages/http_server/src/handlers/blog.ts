import { create_blog, NewBlog, Request, RouterContext } from "../deps.ts";

import { get_blog_by_id } from "@database";

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
    const body = await read_from_data(ctx.request);
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
  } catch (e) {
    console.error("create new blog fail with: %O", body_ref);
    console.error("error info: ", e);
    ctx.response.body = {
      success: false,
      msg: "服务器错误",
    };
  }
}

async function read_from_data(request: Request): Promise<BlogInput> {
  const bodyReader = request.body({ type: "form-data" }).value;
  const stream = bodyReader.stream();
  const result: BlogInput = {};
  while (1) {
    const { done, value } = await stream.next();
    if (done || !value) {
      break;
    }
    const [name, refValue] = value;
    if (typeof refValue === "string") {
      Reflect.set(result, name, refValue);
    } else if (refValue && refValue.filename) {
      const content = await read_file_from_tmp(refValue.filename);
      Reflect.set(result, name, content);
    }
  }
  console.log(result);
  return result;
}

async function read_file_from_tmp(path: string): Promise<string> {
  const decode = new TextDecoder("utf-8");
  const data = await Deno.readFile(path);
  return decode.decode(data);
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

export async function get_blog_detail(
  ctx: RouterContext<
    "/blog/:id",
    {
      id: string;
    } & Record<string | number, string | undefined>,
    Record<string, any>
  >,
) {
  try {
    const id = ctx.params.id?.trim();
    if (!id) {
      throw Error("blog id 不能为空");
    }

    const blog = await get_blog_by_id(id);
    if (blog) {
      ctx.response.body = {
        success: true,
        data: blog,
      };
    } else {
      ctx.response.body = {
        success: false,
        msg: `blog with id "${id}" do not exit.`,
      };
    }
  } catch (e) {
    console.log("Get blog detail fail.");
    console.error("Error info: %O", e);
    ctx.response.body = {
      success: false,
      msg: e?.message || e || "服务器错误",
    };
  }
}
