using Microsoft.Extensions.Logging.Abstractions;
using TheLifeServices.Services;

namespace WebAPI.Middleware;

public class RouteLoggerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RouteLoggerMiddleware> _logger;

    public RouteLoggerMiddleware(RequestDelegate next, ILogger<RouteLoggerMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        _logger.LogWarning($"Request host: \"{context.Request.Host.Value}\"" +
                               $"\n      Method: {context.Request.Method}" + 
                               $"\n      Scheme: {context.Request.Scheme}" +
                               $"\n      Path: {context.Request.Path}");
        await _next.Invoke(context);
    }
}