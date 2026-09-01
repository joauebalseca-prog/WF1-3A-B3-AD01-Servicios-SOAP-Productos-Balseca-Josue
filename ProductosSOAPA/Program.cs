using CoreWCF;
using CoreWCF.Configuration;
using CoreWCF.Description;
using Microsoft.EntityFrameworkCore;
using ProductosSOAPA.Data;
using ProductosSOAPA.Services;

var builder = WebApplication.CreateBuilder(args);

// ============================================
// CORS PARA ANGULAR
// ============================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


// ============================================
// CONEXION A SQL SERVER
// ============================================
builder.Services.AddDbContext<ProductosDBContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("ProductosConnection")
    )
);


// ============================================
// SERVICIO SOAP DE PRODUCTOS
// ============================================
builder.Services.AddScoped<ProductoService>();


// ============================================
// SERVICIO REST DE MOVIMIENTO INVENTARIO
// ============================================
builder.Services.AddScoped<
    IMovimientoInventarioService,
    MovimientoInventarioService>();


// ============================================
// HABILITAR CONTROLADORES REST
// ============================================
builder.Services.AddControllers();


// ============================================
// CONFIGURACION COREWCF / SOAP
// ============================================
builder.Services
    .AddServiceModelServices()
    .AddServiceModelMetadata();

builder.Services.AddSingleton<IServiceBehavior,
    UseRequestHeadersForMetadataAddressBehavior>();


// ============================================
// PERMITIR OPERACIONES SINCRONICAS
// ============================================
builder.WebHost.ConfigureKestrel(options =>
{
    options.AllowSynchronousIO = true;
});


var app = builder.Build();


// ============================================
// HABILITAR CORS
// ============================================
app.UseCors("AngularPolicy");


// ============================================
// ENDPOINT SOAP
// ============================================
app.UseServiceModel(serviceBuilder =>
{
    serviceBuilder
        .AddService<ProductoService>()
        .AddServiceEndpoint<ProductoService, IProductoService>(
            new BasicHttpBinding(),
            "/ProductoService.svc"
        );
});


// ============================================
// HABILITAR WSDL DEL SERVICIO SOAP
// ============================================
var metadataBehavior =
    app.Services.GetRequiredService<ServiceMetadataBehavior>();

metadataBehavior.HttpGetEnabled = true;


// ============================================
// HABILITAR ENDPOINTS REST
// ============================================
app.MapControllers();


// ============================================
// EJECUTAR APLICACION
// ============================================
app.Run();