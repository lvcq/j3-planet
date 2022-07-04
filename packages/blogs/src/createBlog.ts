
export interface NewBlog {
  /**
   * 标题
   */
  title: string;
  /**
   * 概述
   */
  summary: string;
  /**
   *  标签
   */
  tag: string;
  /**
   * 内容 (markdown格式文件)
   */
  content: string;
}

export async function createBlog() {

}