using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace ZeroUI
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton(System.Text.Encodings.Web.HtmlEncoder.Create(System.Text.Unicode.UnicodeRanges.All));
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAnyOrigin", builder =>
                {
                    builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
                });
            });

            services.AddMvc();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            DefaultFilesOptions defaultFilesOptions = new DefaultFilesOptions();
            defaultFilesOptions.DefaultFileNames.Clear();
            defaultFilesOptions.DefaultFileNames.Add("Index.html");
            app.UseDefaultFiles(defaultFilesOptions);

            app.UseStaticFiles();

            app.UseMvc(o => {
                o.MapRoute("Default", "{controller}/{action}/{id}", new { controller = "Home", action = "Index", id = "" });
            });
        }
        
    }
}
