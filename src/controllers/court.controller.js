const Court = require('../models/court.model');

/**
 * @swagger
 * tags:
 *   name: Courts
 *   description: Court management
 */

/**
 * @swagger
 * /api/courts:
 *   post:
 *     summary: Create a new court
 *     tags: [Courts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Court'
 *     responses:
 *       201:
 *         description: Court created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Court'
 *       400:
 *         description: Invalid input
 */
const createCourt = async (req, res) => {
    try {
        const court = new Court(req.body);
        await court.save();
        res.status(201).json(court);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * @swagger
 * /api/courts:
 *   get:
 *     summary: Get all courts
 *     tags: [Courts]
 *     parameters:
 *       - in: query
 *         name: courtType
 *         schema:
 *           type: string
 *           enum: [badminton, pickleball]
 *         description: Filter by court type
 *     responses:
 *       200:
 *         description: List of courts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Court'
 */
const getCourts = async (req, res) => {
    try {
        const query = {};
        if (req.query.courtType) {
            query.courtType = req.query.courtType;
        }
        const courts = await Court.find(query);
        res.json(courts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * @swagger
 * /api/courts/{id}:
 *   get:
 *     summary: Get court by ID
 *     tags: [Courts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Court details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Court'
 *       404:
 *         description: Court not found
 */
const getCourtById = async (req, res) => {
    try {
        const court = await Court.findById(req.params.id);
        if (!court) {
            return res.status(404).json({ error: 'Court not found' });
        }
        res.json(court);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * @swagger
 * /api/courts/{id}:
 *   put:
 *     summary: Update a court by ID
 *     tags: [Courts]   
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string   
 *     responses:
 *       200:
 *         description: A court
 *         content:
 *           application/json:
 *             schema:  
 *               $ref: '#/components/schemas/Court'
 *       404:
 *         description: Court not found
 */
const updateCourt = async (req, res) => {
  try {
    const court = await courtService.updateCourt(req.params.id, req.body);
    res.status(200).json(court);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/courts/{id}:
 *   delete:
 *     summary: Delete a court by ID
 *     tags: [Courts]   
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string   
 *     responses:
 *       204:
 *         description: Court deleted successfully
 */ 
const deleteCourt = async (req, res) => {
  try {
    await courtService.deleteCourt(req.params.id);
    res.status(204).json({ message: "Court deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
    createCourt,
    getCourts,
    getCourtById,
    updateCourt,
    deleteCourt
};
