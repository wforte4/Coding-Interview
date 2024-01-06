import { Request, Response } from 'express';
import { Model } from 'mongoose';

const handleError = (res: Response, err: unknown) => {
  res.status(500).json(err);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deleteOne = (model: Model<any>) => async (req: Request, res: Response) => {
  try {
    const doc = await model.deleteOne({ _id: req.params.id });
    if (!doc) return res.json({});
    return res.json(doc);
  } catch (e) {
    handleError(res, e);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const findOneAndDelete = (model: Model<any>) => async (req: Request, res: Response) => {
  try {
    const doc = await model.findOneAndDelete({ _id: req.params.id });
    if (!doc) return res.json({});
    return res.json(doc);
  } catch (e) {
    handleError(res, e);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const findAll = (model: Model<any>) => async (req: Request, res: Response) => {
  try {
    const doc = model.find({}).exec();
    if (!doc) res.status(400).end();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    model.countDocuments({}, (countErr: any, count: any) => {
      // if (countErr) console.log(countErr);
      res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
      res.setHeader('Content-Range', count);
      doc.then((data) => {
        res.json(data);
      });
    });
  } catch (e) {
    handleError(res, e);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateOne = (model: Model<any>) => async (req: Request, res: Response) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc: any = await model.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      req.body,
      { new: true },
    )
      .lean()
      .exec();

    if (!doc) {
      return res.status(400).end();
    }

    if (doc.password) {
      doc.password = undefined;
    }

    res.status(200).json(doc);
  } catch (e) {
    handleError(res, e);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const findOne = (model: Model<any>) => async (req: Request, res: Response) => {
  try {
    const doc = await model
      .findById(req.params.id)
      .lean()
      .exec();
    if (!doc) res.status(400).json({ error: 'No Document Found' });
    else res.json(doc);
  } catch (e) {
    handleError(res, e);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const create = (model: Model<any>) => async (req: Request, res: Response) => {
  try {
    const doc = await model.create({ ...req.body });
    if (doc.password) doc.password = undefined;
    res.json(doc);
  } catch (e) {
    handleError(res, e);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createWithModelReturn = (model: Model<any>) => async (req: Request, res: Response) => {
  try {
    const doc = await model.create({ ...req.body });
    if (doc.password) doc.password = undefined;
    return doc.toObject();
  } catch (e) {
    handleError(res, e);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (model: Model<any>) => ({
  deleteOne: deleteOne(model),
  findAll: findAll(model),
  findOne: findOne(model),
  create: create(model),
  updateOne: updateOne(model),
  findOneAndDelete: findOneAndDelete(model),
  handleError,
  createWithModelReturn: createWithModelReturn(model),
});
