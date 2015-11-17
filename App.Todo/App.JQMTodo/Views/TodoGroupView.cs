using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Arshu.Web.Common;
using Arshu.Web;
using Arshu.Data;
using Arshu.Web.Json;

namespace AppTodo.Views
{
    public class TodoGroupView : IPartialView
    {
        public string RawUrl { get; set; }
        public string ThemeName { get; set; }
        public string TemplateSuffix { get; set; }

        [Help("ViewName=Default, Json Data =[dataIndex:1, appendIndex:true]")]
        public string GetView(string viewName, Arshu.Web.Json.JsonObject jsonData)
        {
            string html = "";

            string id = "taskList";
            string status = "0";
            int pageNo = 1;
            int itemsperpage = 5;
            if (jsonData != null)
            {
                if (jsonData.ContainsKey("id") == true)
                {
                    id = jsonData["id"].ToString();
                }
                if (jsonData.ContainsKey("pageNo") == true)
                {
                    pageNo = Convert.ToInt32(jsonData["pageNo"].ToString());
                }
                if (jsonData.ContainsKey("itemsperpage") == true)
                {
                    itemsperpage = Convert.ToInt32(jsonData["itemsperpage"].ToString());
                }
            }


            string dbName = "todogroup.v1.db";
            var groupStatement = "Select GroupId from TDC_Group";
            long groupId = 0;
            JsonDbService jsonDbService = new JsonDbService(true);
            JsonObject jsonGroupData = jsonDbService.DoSelectScalar(dbName, groupStatement);
            if (jsonGroupData.ContainsKey("data") ==true) groupId = Convert.ToInt64(jsonGroupData["data"]);

            string selectStatement = "Select * from TDD_Task Where IsCompleted = " + status + " and GroupID =" + groupId + " Order by IsCompleted, TaskID desc";

            JsonHtmlService jsonHtmlService = new JsonHtmlService();
            JsonObject jsonList = jsonHtmlService.GetHtmlPaged("todogroup.v1.db", selectStatement, "liTodoGroupPending", id, pageNo, itemsperpage, "liItemHeader", "liItemFooter");

            var totalPages = 0;
            if (jsonList.ContainsKey("totalPages") == true) {
                totalPages = Convert.ToInt32(jsonList["totalPages"].ToString());
            }

            if (jsonList.ContainsKey("html") == true)
            {

                string headerList = "";
                string footerList = "";

                if (totalPages >= 1) {
                    if (jsonList.ContainsKey("htmlHeader") == true) {
                        headerList = jsonList["htmlHeader"].ToString();
                    }
                    if (jsonList.ContainsKey("htmlFooter") == true) {
                        footerList = jsonList["htmlFooter"].ToString();
                    }
                }

                string content = jsonList["html"].ToString();

                html = headerList + content + footerList;
            }
            else
            {
                html = "<li style='white-space:normal;'><div>No Pending Task(s) Found</div></li>";
            }
            return html;
        }
    }
}
