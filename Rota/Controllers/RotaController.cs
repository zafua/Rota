using Rota.Models;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Rota.Controllers
{
    public class RotaController : Controller
    {
        //
        // GET: /Rota/

        public ActionResult Index()
        {

            ViewBag.ProjectList = GetProjects();

            return View();
        }

        public ActionResult GetProjectData(int id)
        {
            var ent = new RotaDBEntities();

            var lstProjects = (from c in ent.Project where c.ProjectId == id select c).OrderBy(x => x.UpdateDate).ToList();
            lstProjects = lstProjects.Take(lstProjects.Count() - 1).ToList();
            var serializerSettings = new JsonSerializerSettings();
            serializerSettings.Converters.Add(new IsoDateTimeConverter());
            var json = JsonConvert.SerializeObject(lstProjects, serializerSettings);

            return Json(new { projectlist = json }, JsonRequestBehavior.AllowGet);



        }

        public ActionResult GetMonth()
        {

            return PartialView("Month", GetProjects());
        }
        public ActionResult GetQuart()
        {

            return PartialView("Quarter", GetProjects());
        }

        public List<Project> GetProjects()
        {
            using (var ent = new RotaDBEntities())
            {
                var lstProjects = (from c in ent.Project select c).
                    GroupBy(p => p.ProjectId).
                    Select(g => g.OrderByDescending(x => x.UpdateDate).FirstOrDefault()).ToList();

                return lstProjects;
            }
        }


    }
}
