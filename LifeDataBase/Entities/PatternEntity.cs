﻿using TheLiveLogic.Fields;

namespace LifeDataBase.Entities;

public class PatternEntity
{
    public long Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string PreviewBase64 { get; set; }
    public DateTime LastChange { get; set; }
    public List<Coord> Survivors { get; set; }
}