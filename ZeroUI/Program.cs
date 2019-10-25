using System;
using System.Collections.Generic;
using System.IO;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ZeroUI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args)
        {
            var host = new WebHostBuilder();
            host.UseKestrel()
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseWebRoot(System.IO.Path.Combine(Directory.GetCurrentDirectory(), @"zeroUI"))
                .UseStartup<Startup>();
            return host;
        }
    }
}
