using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Gif;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

if (args.Length < 2)
{
    Console.Error.WriteLine("Usage: MeatWednesdayGifGen <input> <output>");
    return 1;
}

var inputPath = Path.GetFullPath(args[0]);
var outputPath = Path.GetFullPath(args[1]);

using var source = await Image.LoadAsync<Rgba32>(inputPath);

const int canvasWidth = 900;
const int canvasHeight = 900;
const int totalFrames = 32;
const int frameDelayCs = 8;

var scales = Enumerable.Range(0, totalFrames)
    .Select(i =>
    {
        var t = i / (double)(totalFrames - 1);
        return 0.55 + 0.6 * Math.Sin(t * Math.PI);
    })
    .Concat(Enumerable.Range(1, totalFrames - 2).Reverse().Select(i =>
    {
        var t = i / (double)(totalFrames - 1);
        return 0.55 + 0.6 * Math.Sin(t * Math.PI);
    }))
    .ToArray();

Image<Rgba32>? gif = null;

foreach (var scale in scales)
{
    var frameWidth = Math.Max(1, (int)(source.Width * scale));
    var frameHeight = Math.Max(1, (int)(source.Height * scale));

    using var resized = source.Clone(ctx => ctx.Resize(new ResizeOptions
    {
        Mode = ResizeMode.Max,
        Size = new Size(frameWidth, frameHeight),
        Sampler = KnownResamplers.Lanczos3
    }));

    var background = Color.ParseHex("FFF5D6");
    var frame = new Image<Rgba32>(canvasWidth, canvasHeight, background);
    var x = (canvasWidth - resized.Width) / 2;
    var y = (canvasHeight - resized.Height) / 2;

    frame.Mutate(ctx =>
    {
        ctx.DrawImage(resized, new Point(x, y), 1f);
    });

    frame.Metadata.GetGifMetadata().RepeatCount = 0;
    frame.Frames.RootFrame.Metadata.GetGifMetadata().FrameDelay = frameDelayCs;

    if (gif is null)
    {
        gif = frame;
    }
    else
    {
        gif.Frames.AddFrame(frame.Frames.RootFrame);
        frame.Dispose();
    }
}

if (gif is null)
{
    Console.Error.WriteLine("No frames generated.");
    return 1;
}

Directory.CreateDirectory(Path.GetDirectoryName(outputPath)!);
await gif.SaveAsGifAsync(outputPath, new GifEncoder());
gif.Dispose();

return 0;
