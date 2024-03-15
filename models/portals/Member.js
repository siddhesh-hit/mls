const mongoose = require("mongoose");

const ImageSchema = require("./imageSchema");

const memberSchema = new mongoose.Schema(
  {
    basic_info: {
      house: {
        type: String,
      },
      assembly_number: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assembly",
      },
      constituency_from: {
        type: String,
      },
      constituency_to: {
        type: String,
      },
      profile: ImageSchema,
      name: {
        type: String,
      },
      surname: {
        type: String,
      },
      constituency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Constituency",
      },
      party: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PoliticalParty",
      },
      gender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gender",
      },
      district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "District",
      },
      first_time_elected: {
        type: String,
      },
      date_of_birth: {
        type: String,
      },
      place_of_birth: {
        type: String,
      },
      education: {
        type: String,
      },
      language: {
        type: String,
      },
      marital_status: {
        type: String,
      },
      children: {
        type: String,
      },
      business: {
        type: String,
      },
      hobby: {
        type: String,
      },
      foreign_migration: {
        type: String,
      },
      address: {
        type: String,
      },
      address1: {
        type: String,
      },
      mobile_number: {
        type: String,
      },
      email: {
        type: String,
      },
      awards: {
        type: String,
      },
      other_info: {
        type: String,
      },
    },
    political_journey: [
      {
        date: {
          type: String,
        },
        presiding: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "PresidingOfficer",
        },
        legislative_position: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "LegislationPosition",
        },
        designation: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Designation",
        },
        title: {
          type: String,
        },
      },
    ],
    election_data: {
      constituency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Constituency",
      },
      total_electorate: {
        type: String,
      },
      total_valid_voting: {
        type: String,
      },
      member_election_result: [
        {
          candidate_name: {
            type: String,
          },
          votes: {
            type: String,
          },
          party: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PoliticalParty",
          },
        },
      ],
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Archived"],
      default: "Pending",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

// delete mongoose.models.LegislativeMember;
// delete mongoose.modelNames.LegislativeMember;

const Member = mongoose.model("Member", memberSchema);

module.exports = Member;
